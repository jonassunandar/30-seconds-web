import literals from 'lang/en/client/search';

describe('Search', () => {
  before(() => {
    cy.visit('http://localhost:9000');
    cy.get('input[type="search"]').type('difference{enter}');
  });

  it('should redirect to the search page', () => {
    cy.url().should('contain', '/search');
    cy.url().should('contain', 'keyphrase=difference');
  });

  describe('search results', () => {
    it('should display the correct title', () => {
      cy.get('.page-title').contains(literals.results);
    });

    it('should display search results', () => {
      cy.get('.preview-card').its('length').should('gte', 1);
    });

    it('should display at least one snippet with the given query in its name', () => {
      cy.get('.card-title').contains('difference');
    });
  });

  describe('clicking a result', () => {
    before(() => {
      cy.get('.card-title a').first().click();
    });

    it('should display the correct breadcrumbs', () => {
      cy.get('.link-back').contains(literals.search);
    });

    describe('returning to search', () => {
      before(() => {
        cy.get('.link-back').first().click();
      });

      it('should return to the last search page', () => {
        cy.url().should('contain', '/search');
        cy.url().should('contain', 'keyphrase=difference');
      });
    });
  });

  describe('search refinement', () => {
    before(() => {
      cy.get('input[type="search"]').type('By');
    });

    it('should update the URL', () => {
      cy.url().should('contain', '/search');
      cy.url().should('contain', 'keyphrase=differenceBy');
    });

    it('should update search results to match the new query', () => {
      cy.get('.card-title').contains('differenceBy');
    });
  });

  describe('dead end search', () => {
    before(() => {
      cy.get('input[type="search"]').type('withoutresultsthisisnotlikelytofindanything');
    });

    it('should return no results', () => {
      cy.get('.search-no-results').should('have.length', 1);
    });

    it('should display a recommendation list', () => {
      cy.get('.recommendation-list-title').should('have.length', 1);
    });
  });
});
