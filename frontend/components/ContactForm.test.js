import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);

    const headerElement = screen.queryByText(/contact form/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "123");

    const errMssg = await screen.findAllByTestId('error');
    expect(errMssg).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitBttn = screen.getByRole("button");
    userEvent.click(submitBttn);

    await waitFor(() => {
        const errMssg = screen.queryAllByTestId("error");
        expect(errMssg).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "sadia");
    
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "grayy");

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errMssg = await screen.getAllByTestId("error");
    expect(errMssg).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "sadia@email");

    const errMssg = await screen.findByText(/email must be a valid email address/i);
    expect(errMssg).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitBttn = screen.getByRole("button");
    userEvent.click(submitBttn);

    const errMssg = await screen.findByText(/lastName is a required field/i);
    expect(errMssg).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);

    userEvent.type(firstNameInput, "sadia");
    userEvent.type(lastNameInput, "grayy");
    userEvent.type(emailInput, "sadia@email.com");

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("sadia");
        const lastNameDisplay = screen.queryByText("grayy");
        const emailDisplay = screen.queryByText("sadia@email.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    
    const firstNameInput = screen.getByLabelText(/first name*/i);
    const lastNameInput = screen.getByLabelText(/last name*/i);
    const emailInput = screen.getByLabelText(/email*/i);
    const messageInput = screen.getByLabelText(/message/i);

    userEvent.type(firstNameInput, "sadia");
    userEvent.type(lastNameInput, "grayy");
    userEvent.type(emailInput, "sadia@email.com");
    userEvent.type(messageInput, "a little message here");

    const button = screen.getByRole("button");
    userEvent.click(button);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText("sadia");
        const lastNameDisplay = screen.queryByText("grayy");
        const emailDisplay = screen.queryByText("sadia@email.com");
        const messageDisplay = screen.queryByText("a little message here");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    })
});
