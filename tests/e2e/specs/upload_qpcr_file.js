describe('qPCR', () => {
  it('10ul - upload file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]').as('fileInput').attachFile('qPCR_10ul.txt')
    cy.get('select[id="quant-type"]').select('libraryQPCR10ul')
    cy.contains('button', 'Upload').click()
    cy.contains('DN1234567')
    cy.get('td').should('have.length', 384)

    cy.visit('#/plates')
    cy.contains('DN1234567').click()
    cy.get('h3').contains('DN1234567')
  })

  it('5ul - upload file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]')
      .as('fileInput')
      .attachFile('DN123456_DN123456-QC_XYZ_results.csv')
    cy.get('select[id="quant-type"]').select('libraryQPCR5ul')
    cy.contains('button', 'Upload').click()
    cy.get('h3').contains('DN123456')
    cy.get('td').should('have.length', 384)

    cy.visit('#/plates')
    cy.contains('DN123456').click()
    cy.contains('DN123456')
  })
})
