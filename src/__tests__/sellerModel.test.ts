import sellerModel from "../models/sellerModel";

describe('test sellerModel::validation', () => {
    it('case 1. must return that the document is required', () => {
        const hasErrors = (new sellerModel({})).validateSync(['document']);
        expect(hasErrors?.message).toContain('document:')
    });
    it('case 2. should return that it is not a valid document', () => {
        const hasErrors = (new sellerModel({document: '123'})).validateSync(['document']);
        expect(hasErrors?.message).toContain('is not a valid document')
    });
    it('case 3. should return that it is not a valid name', () => {
        const hasErrors = (new sellerModel({name: 'teste'})).validateSync(['name']);
        expect(hasErrors?.message).toContain('is not a full name')
    });
    it('case 4. should return that it is not valid email', () => {
        const hasErrors = (new sellerModel({email: 'test@boticario'})).validateSync(['email']);
        expect(hasErrors?.message).toContain('is not a valid email')
    });
    it('case 5. should return that it is not a valid password', () => {
        const hasErrors = (new sellerModel({password: ''})).validateSync(['password']);
        expect(hasErrors?.message).toContain('is required')
    });
    it('case 6. should not return errors', () => {
        const hasErrors = (new sellerModel({name: 'teste completo', document: '12345678901', email: 'teste@boticario.dev', password: 'asdf'})).validateSync();
        expect(hasErrors).toBeUndefined()
    });
});