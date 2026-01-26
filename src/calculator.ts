import type { CostHistoryItems, Employee, EmployeesFile, TimeEntry, TimeEntryFile } from "./index.js"

type CostEntrySuccess = {
    ok: true,
    costEntry: CostHistoryItems
}

type CostEntryError = {
    ok: false,
    message: string
}

type CostEntryResult = CostEntrySuccess | CostEntryError

const totalWorksHours: number = 40 * 52

// calculate hourly rate according to the annual salary
function calculateHourlyRate (annualSalary: number) {

    const hourlyRate = annualSalary / totalWorksHours
    return hourlyRate

}

// apply multipliers 
function applyMultipliers (baseRate: number, benefitsPercent:number, overheadMultiplier: number) {
    const baseSalary = baseRate * totalWorksHours
    const benefitsPercentCost = (baseSalary * benefitsPercent) / 100
    const totalSalary = (baseSalary + benefitsPercentCost) * overheadMultiplier
    const totalHourlyRate = totalSalary / totalWorksHours
    return totalHourlyRate
}

function findCostEntryForDate (costHistory:CostHistoryItems[], targetDate:Date):CostEntryResult {

    const validCostHistory = costHistory.filter(c => new Date(c.effectiveDate) <= targetDate)
    const sortedCostHistory = validCostHistory.sort((a,b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())

    if (sortedCostHistory.length === 0 ) {
        return {ok: false, message: `no cost data available for this target data (${targetDate.toISOString().split('T')[0]})`}
    }
    const costEntry = sortedCostHistory[0]
    // if no cost entry is found to handle the undefined erro
    if (!costEntry) return {ok: false, message: `no cost data available for this target data (${targetDate.toISOString().split('T')[0]})`}
    return {
        ok: true,
        costEntry
    }
}

type EmployeeCostSuccess = {
    ok: true,
    employee: string,
    employeeName: string,
    department: string,
    date: string,
    baseSalary: number,
    hourlyCost: number
}

type EmployeeCostError = {
    ok: false,
    employee: string,
    employeeName: string,
    error: string
}

type EmployeeCostResult = EmployeeCostSuccess | EmployeeCostError

function calculateEmployeeCost (employee:Employee, date:Date):EmployeeCostResult {
    
    const result = findCostEntryForDate(employee.costHistory, date)

   if (result.ok === false) {

    return {
        ok: false,
        employee: employee.id,
        employeeName: employee.name,
        error: "No cost data available for this date!"
    }

   }

   const constEntry = result.costEntry
   const baseSalary = constEntry.baseSalary
   const baseHourlyRate = calculateHourlyRate(baseSalary)

   const finalHourlyCost = applyMultipliers(baseHourlyRate, constEntry.benefitsPercent, constEntry.overheadMultiplier)

   return {
    ok: true,
    employee: employee.id,
    employeeName: employee.name,
    department: employee.department,
    date: date.toISOString().substring(0, 10),
    baseSalary,
    hourlyCost: Math.round(finalHourlyCost)
   }
}

type ProcessedTimeEntry = 
    | (TimeEntry & {error: string})
    | (TimeEntry & {
        hourlyCost: number,
        totalCost: number,
        employeeName: string,
        department: string
    })


function processAllTimeEntries (employees:EmployeesFile, timeEntries:TimeEntryFile):ProcessedTimeEntry[] {

    const results: ProcessedTimeEntry[] = []

    for (const entry of timeEntries.timeEntries) {
        
        const empData = employees.employees.find(e => e.id === entry.employeeId)

        if (!empData) {
            results.push({
                ...entry,
                error: "Employee not found!"
            })
            continue
        }

        const costData = calculateEmployeeCost(empData, new Date(entry.date))

        if (costData.ok === false) {
            results.push({
                ...entry,
                error: costData.error
            })
            continue
        }

        const totalCost = entry.hours * costData.hourlyCost

        results.push({
            ...entry,
            employeeName: costData.employeeName,
            department: costData.department,
            hourlyCost: costData.hourlyCost,
            totalCost: Math.round(totalCost)
        })

    }
    return results
}



export default {
    calculateEmployeeCost,
    processAllTimeEntries,
    findCostEntryForDate,
    applyMultipliers,
    calculateHourlyRate
}