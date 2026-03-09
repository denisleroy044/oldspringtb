import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const {
      taxYear,
      filingStatus,
      income,
      deductions,
      credits,
      withholding
    } = data

    // Get tax brackets for calculation
    const bracketsRes = await query(
      `SELECT rate, income_from, income_to 
       FROM tax_brackets 
       WHERE tax_year = $1 AND filing_status = $2
       ORDER BY income_from ASC`,
      [taxYear, filingStatus]
    )

    const brackets = bracketsRes.rows

    // Get standard deduction
    const stdDedRes = await query(
      `SELECT amount FROM standard_deductions 
       WHERE tax_year = $1 AND filing_status = $2`,
      [taxYear, filingStatus]
    )

    const standardDeduction = stdDedRes.rows[0]?.amount || 0

    // Calculate taxable income
    const totalIncome = income?.total || 0
    const itemizedDeductions = deductions?.itemized || 0
    const useStandardDeduction = deductions?.useStandard !== false
    
    const deductionAmount = useStandardDeduction ? standardDeduction : itemizedDeductions
    const taxableIncome = Math.max(0, totalIncome - deductionAmount)

    // Calculate tax liability using brackets
    let taxLiability = 0
    let remainingIncome = taxableIncome

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break
      
      const bracketAmount = Math.min(remainingIncome, bracket.income_to - bracket.income_from + 1)
      taxLiability += bracketAmount * (bracket.rate / 100)
      remainingIncome -= bracketAmount
    }

    // Apply tax credits
    let totalCredits = 0
    if (credits) {
      if (credits.childTaxCredit) totalCredits += credits.childCount * 2000
      if (credits.educationCredit) totalCredits += 2500
      if (credits.earnedIncomeCredit) totalCredits += 1500
      if (credits.retirementSavingsCredit) totalCredits += 1000
      if (credits.energyCredit) totalCredits += 500
      if (credits.foreignTaxCredit) totalCredits += credits.foreignTaxPaid || 0
    }

    taxLiability = Math.max(0, taxLiability - totalCredits)

    // Calculate total payments
    const totalPayments = (withholding?.federal || 0) + 
                         (withholding?.estimated || 0) + 
                         (withholding?.priorYearCredit || 0)

    // Calculate refund or amount due
    let refundAmount = 0
    let amountDue = 0

    if (totalPayments > taxLiability) {
      refundAmount = totalPayments - taxLiability
    } else if (taxLiability > totalPayments) {
      amountDue = taxLiability - totalPayments
    }

    return NextResponse.json({
      success: true,
      calculation: {
        totalIncome,
        totalDeductions: deductionAmount,
        taxableIncome,
        taxLiability,
        totalCredits,
        totalPayments,
        refundAmount,
        amountDue,
        effectiveTaxRate: totalIncome > 0 ? (taxLiability / totalIncome) * 100 : 0
      }
    })

  } catch (error) {
    console.error('Error calculating tax:', error)
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 })
  }
}
