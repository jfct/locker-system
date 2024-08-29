// Hide console.errors from the testing
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
});
