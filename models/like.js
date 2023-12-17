import Model from './model.js';

export default class Like extends Model {
    constructor()
    {
        super();
        this.addField('pubId', 'string');
        this.addField('userId', 'string');        

        this.setKey("Title");
    }
}