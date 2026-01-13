// import employeeData from "./data/employees.json"
import fs  from "fs/promises";
import calculator from "./calculator.js";


async function main () {
    try {

        const employeesData = await fs.readFile("./data/employees.json", "utf-8")
        const employees = JSON.parse(employeesData).employees

        const timeEntriesData = await fs.readFile("./data/time-entries.json", "utf-8")
        const timeEntries = JSON.parse(timeEntriesData).timeEntries
        
        const results = calculator.processAllTimeEntries(employees, timeEntries)
        console.log('results', results);
        

        console.log(`\n=== COST CALCULATIONS RESULTS ===\n`);

        for (const result of results) {
            console.log(`${result.employeeName} - ${result.date}`)
            console.log(`Hours: ${result.hours}`)
            console.log(`Rate: ${result.hourlyCost}$/hr`)
            console.log(`Total: ${result.totalCost}$`)
            console.log('')
        }
        
        const totalCost = results.reduce((sum, r) => sum + r.totalCost, 0 )
        console.log('totallllll',totalCost);
        const totalHours = results.reduce((sum, r) => sum + r.hours, 0)

        console.log('=== SUMMARY ===');
        console.log(`Total Hours: ${totalHours}`);
        console.log(`Total Cost: $${totalCost.toFixed(2)}`);
        console.log('');

        const output = {
            generatedAt: new Date().toISOString(),
            totalCost,
            totalHours,
            details: results
        }

        await fs.mkdir("output", {recursive: true})
        await fs.writeFile("output/report.json", JSON.stringify(output, null, 2))

        console.log(" Report saved to output/report.json\n");
        
        
    } catch (error) {
    console.error("Error:", error)    
    }    
}

main()