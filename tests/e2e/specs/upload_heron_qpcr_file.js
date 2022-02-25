describe('heron qPCR', () => {
  it('upload file, check plate is stored', () => {
    cy.visit('/')
    cy.get('input[type="file"]')
      .as('fileInput')
      .attachFile('HT_132817_2897_2945_2956_HERON_16_2_22_results.csv')
    cy.get('select[id="quant-type"]').select('Heron - qPCR')
    cy.contains('button', 'Upload').click()
    cy.get('.row > h3').contains('HT-132817')
    cy.get('td').should('have.length', 384)

    cy.visit('#/plates')
    cy.contains('132817').click()
    cy.get('.row > h3').contains('HT-132817')

    cy.intercept('POST', '**/qc_assays', {
      statusCode: 201,
      body: {},
    }).as('postPayload')

    cy.contains('button', 'Export').click()

    cy.fixture('heronQPCRRequest').then((data) => {
      cy.wait('@postPayload').its('request.body').should('deep.equal', data)
    })
  })
})
