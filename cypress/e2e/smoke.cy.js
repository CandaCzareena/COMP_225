describe('ColtCircle smoke E2E', () => {
  const email = `cypress_${Date.now()}@school.edu`;
  const password = 'cypress123';

  it('loads auth screen with ColtCircle branding', () => {
    cy.visit('/');
    cy.contains('ColtCircle').should('be.visible');
    cy.contains(/Login|Sign Up|Welcome back|Join the circle/i).should('exist');
  });

  it('registers and reaches the home feed', () => {
    cy.visit('/');
    cy.contains(/Register here|Login here/i).then(($el) => {
      if ($el.text().includes('Register here')) {
        cy.wrap($el).click();
      }
    });

    cy.get('select[name="role"]').select('student');
    cy.get('input[name="name"]').type('Cypress Tester');
    cy.get('input[name="program"]').type('Software Engineering');
    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();

    cy.contains(/Welcome back/i, { timeout: 15000 }).should('be.visible');
    cy.contains('Home').should('exist');
  });

  it('can open marketplace and messages from navigation', () => {
    cy.visit('/');
    // If still on auth, log in with previous user
    cy.get('body').then(($body) => {
      if ($body.find('input[name="email"]').length) {
        cy.get('input[name="email"]').clear().type(email);
        cy.get('input[name="password"]').clear().type(password);
        cy.get('button[type="submit"]').click();
        cy.contains(/Welcome back/i, { timeout: 15000 }).should('be.visible');
      }
    });

    cy.contains(/Market|Marketplace/i).click({ force: true });
    cy.contains(/Marketplace|Sell Item|listings/i, { timeout: 10000 }).should('exist');

    cy.contains(/Chats|Messages/i).click({ force: true });
    cy.contains(/Chats|Select a conversation|No conversations/i, {
      timeout: 10000,
    }).should('exist');
  });
});
