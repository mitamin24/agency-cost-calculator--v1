import fs from 'fs/promises'
import type { CostHistoryItems, Employee, EmployeesFile, TimeEntry, TimeEntryFile } from "./index.js"

// Result types for costCalculator function
type CostCalculatorSuccess = {
    hourlyCostRaw: number,
    totalCostRaw: number,
    dayCost: number
}

type CostCalculatorError = {
    error: true,
    message: string
}

type CostCalculatorResult = CostCalculatorSuccess | CostCalculatorError

// Result types for processAllTimeEntries function
type ProcessedEntrySuccess = TimeEntry & {
    hourlyCostRaw: number,
    totalCostRaw: number,
    dayCost: number,
    totalCost: number
}

type ProcessedEntryError = TimeEntry & {
    error: string
}

type ProcessedEntry = ProcessedEntrySuccess | ProcessedEntryError

const totalWorksHours: number = 40 * 52

function costCalculator(costEntries: CostHistoryItems[], date: Date, hoursWorked: number): CostCalculatorResult {

    const costHistory = costEntries.filter(e => new Date(e.effectiveDate) <= date)
    const sorted = costHistory.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime())

    if (sorted.length === 0) {
        return {
            error: true,
            message: "no cost data available for this particular date"
        }
    }

    const correctCostHistory = sorted[0]
    if (!correctCostHistory) {
        return {
            error: true,
            message: "no cost data available for this particular date"
        }
    }

    const baseSalary = correctCostHistory.baseSalary
    const hourlyRate = baseSalary / totalWorksHours
    const benefitPercentCost = (correctCostHistory.baseSalary * correctCostHistory.benefitsPercent) / 100
    const TotalCost = (benefitPercentCost + correctCostHistory.baseSalary) * correctCostHistory.overheadMultiplier
    const hourlyCost = TotalCost / totalWorksHours
    const dayCost = hoursWorked * hourlyCost

    return {
        hourlyCostRaw: hourlyCost,
        totalCostRaw: TotalCost,
        dayCost: Math.round(dayCost)
    }
}

function processAllTimeEntries(employees: Employee[], timeEntries: TimeEntry[]): ProcessedEntry[] {

    const final: ProcessedEntry[] = []

    for (const entry of timeEntries) {

        const em = employees.find(e => e.id === entry.employeeId)

        if (em === undefined) {
            final.push({
                ...entry,
                error: "Employee not found!"
            })
            continue
        }

        const result = costCalculator(em.costHistory, new Date(entry.date), entry.hours)

        // Check if result is an error
        if ('error' in result) {
            final.push({
                ...entry,
                error: result.message
            })
            continue
        }

        const totalCost = result.hourlyCostRaw * entry.hours

        final.push({
            ...entry,
            ...result,
            totalCost: Math.round(totalCost)
        })
    }
    return final
}

async function main() {
    try {
        const employeeData = await fs.readFile("./src/data/employees.json", "utf-8")
        const employeesFile = JSON.parse(employeeData) as EmployeesFile
        const employees = employeesFile.employees

        const timeData = await fs.readFile("./src/data/time-entries.json", "utf-8")
        const timeEntriesFile = JSON.parse(timeData) as TimeEntryFile
        const timeEntries = timeEntriesFile.timeEntries

        console.log(processAllTimeEntries(employees, timeEntries))

    } catch (err) {
        console.error(err)
    }
}

main()