// console.log(employeeData.employees)
// console.log(employeeTimeEntry)
const totalWorksHours = 40 * 52  /* weekly hours * total weeks */ 

// TO calculate hourly rate according to annual salary
function calculateHourlyRate (annualSalary) {
    const hourlyRate = annualSalary / totalWorksHours
    return hourlyRate 
}

// console.log(calculateHourlyRate(80000))

function applyMultipliers (baseRate, benefitsPercent, overheadMultiplier) {
    const baseSalary = baseRate * totalWorksHours
    const benefitPercentCost = (baseSalary * benefitsPercent) / 100
    const totalSalary = (baseSalary + benefitPercentCost) * overheadMultiplier
    const totalHourlyRate = totalSalary / totalWorksHours
    return totalHourlyRate
}

// console.log(applyMultipliers(38.46, 20, 1.3))
const dec15 = new Date("2025-12-15")
const feb23 = new Date ("2023-02-23")
const jun24 = new Date ("2004-06-24")


function findCostEntryForDate (costHistory, targetDate) {
   const validCostHistory = costHistory.filter(c => new Date(c.effectiveDate) <= targetDate)
   const sortedCostHistory = validCostHistory.sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))
//    console.log("sortedcost", sortedCostHistory)
    if (sortedCostHistory.length === 0) {
        return {error: true, message: `no cost data available for this target date (${targetDate.toISOString().split('T')[0]})`}
    }
    return sortedCostHistory[0]
}

// console.log(findCostEntryForDate(fuck.employees[0].costHistory, dec15));


function calculateEmployeeCost (employee, date) {

    const costEntry = findCostEntryForDate ( employee.costHistory, date )
    // console.log(costEntry)
    
    if (costEntry.error) {
        return {
            employeeId: employee.id,
            employeeName: employee.name,
            error: "No cost data available for this date"
        }
    }

    const baseSalary = costEntry.baseSalary
    const baseRate = calculateHourlyRate (baseSalary)
    // console.log(baseRate);
    
    const finalHourlyRate = applyMultipliers (baseRate, costEntry.benefitsPercent, costEntry.overheadMultiplier )
    
    return {
        employee: employee.id,
        employeeName: employee.name,
        department : employee.department,
        date: date.toISOString().split('T')[0],
        baseSalary: costEntry.baseSalary,
        hourlyCost: Math.round(finalHourlyRate)
    }

}
// console.log(calculateEmployeeCost(fuck.employees[0], dec15))

function processAllTimeEntries (employees, timeEntries) {

  const results = []

for (const entry of timeEntries) {
  
  const empData = employees.find(e => e.id === entry.employeeId)
  
  if (!empData) {
    results.push({
      ...entry,
      error: "Employee not found!"
    })
    continue
  }

  const costData = calculateEmployeeCost(empData, new Date(entry.date))
  
  const totalCost = entry.hours * costData.hourlyCost

  results.push({
    ...entry,
    ...costData,
    totalCost: Math.round(totalCost) 
  })
}
  return results
}

export default {
  calculateHourlyRate,
  applyMultipliers,
  findCostEntryForDate,
  calculateEmployeeCost,
  processAllTimeEntries
}


