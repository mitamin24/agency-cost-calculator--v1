import fs from "fs/promises"
import calculator from "./calculator.js"
import employeeData from "./data/employees.json" with { type: "json" };
import timeEntries from "./data/time-entries.json" with { type: "json" };

export interface CostHistoryItems {
    effectiveDate :string,
    baseSalary: number,
    benefitsPercent: number,
    overheadMultiplier: number
}

export interface Employee {
    id: string,
    name: string,
    role: string,
    department: string,
    costHistory: CostHistoryItems[]
}

export interface EmployeesFile {
    employees: Employee[]
}

export interface TimeEntry {
    employeeId: string,
    date: string,
    hours: number,
    project: string

}

export interface TimeEntryFile {
    timeEntries: TimeEntry[]
}

async function main () {
   try {

        const employeesData = await fs.readFile("./src/data/employees.json", "utf-8")
        const employeesFile = JSON.parse(employeesData) as EmployeesFile

        const timeEntriesData = await fs.readFile("./src/data/time-entries.json", "utf-8")
        const timeEntriesFile = JSON.parse(timeEntriesData) as TimeEntryFile
        
        const results = calculator.processAllTimeEntries(employeesFile, timeEntriesFile)
        console.log('results', results);
        

        console.log(`\n=== COST CALCULATIONS RESULTS ===\n`);
        // this is to filter out the error results
        const successfulResults = results.filter(
            (r): r is TimeEntry & {
                hourlyCost: number
                totalCost: number
                employeeName: string
                department: string
            } => 'hourlyCost' in r
        )


        for (const result of successfulResults) {
            console.log(`${result.employeeName} - ${result.date}`)
            console.log(`Hours: ${result.hours}`)
            console.log(`Rate: ${result.hourlyCost}$/hr`)
            console.log(`Total: ${result.totalCost}$`)
            console.log('')
        }
        
        const totalCost = successfulResults.reduce((sum, r) => sum + r.totalCost, 0)
        // console.log('totallllll', totalCost);
        const totalHours = successfulResults.reduce((sum, r) => sum + r.hours, 0)

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