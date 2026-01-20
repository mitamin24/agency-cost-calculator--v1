import fs from 'fs/promises'

async function main () {
    try {
    const employeeData = await fs.readFile("./data/employees.json")
    const employee = JSON.parse(employeeData).employees
    
    const costHistory = employee[0].costHistory
    // console.log(costHistory);
    

    const timeData = await fs.readFile("./data/time-entries.json")
    const employeeTimeEntry = JSON.parse(timeData).timeEntries
    // console.log(employeeTimeEntry);

    const totalWorksHours = 40 * 52
    const march25 = new Date("2024-01-25")


    function costCalculator (costEntries, date, hoursWorked) {

        const costHistory = costEntries.filter(e => new Date(e.effectiveDate) <= date )
        const sorted = costHistory.sort((a,b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))
        // console.log("afadffd",costHistory);
        // console.log("afadffd",sorted);

        if(sorted.length === 0) {
            return {
                error: true,
                message: "no cost data available for this particular date"
            }
        }

        const correctCostHistory = sorted[0]
        // console.log(correctCostHistory);
        const baseSalary = correctCostHistory.baseSalary
        const hourlyRate = baseSalary / totalWorksHours
        // console.log("hourly cost => =>", hourlyRate);
        const benifitPercentCost = (correctCostHistory.baseSalary * correctCostHistory.benefitsPercent) / 100
        // console.log(benifitPercentCost);
        const TotalCost = (benifitPercentCost + correctCostHistory.baseSalary) * correctCostHistory.overheadMultiplier
        // console.log(TotalCost);
        const hourlyCost = TotalCost / totalWorksHours
        // console.log(hourlyCost)
        const dayCost = hoursWorked * hourlyCost
        return {
            hourlyCostRaw: hourlyCost,  // Raw number for calculations
            totalCostRaw: TotalCost,  // Raw number for calculations
            dayCost: Math.round(dayCost)
        }
        
    }

    function processAllTimeEntries (employee, employeeTimeEntry) {

        const final = []

        for (const entry of employeeTimeEntry) {
            
            const em = employee.find(e => Number(e.id) === Number(entry.employeeId) )
            // console.log("sdssddsdsdsd",em);

             if (em === undefined) {
                final.push({
                    ...entry,
                    error: "Employee not found!"
                })
                continue
            }

            const result = costCalculator(em.costHistory, new Date(entry.date), entry.hours)
            const totalCost = result.hourlyCostRaw * Number(entry.hours)
            // console.log( "=> => => ",totalCost);
            

            final.push({
                ...entry,
                ...result,
                totalCost: Math.round(totalCost)
            })
        }
        return final

    }

    console.log(processAllTimeEntries(employee, employeeTimeEntry));
    
    

    
    // console.log(costCalculator(costHistory, march25))

    } catch (err) {
        console.error(err)
    }

}
main()