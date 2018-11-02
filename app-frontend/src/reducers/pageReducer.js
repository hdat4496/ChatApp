import { Actions } from '../constants';

const page = (state = '', action) => {
    switch (action.type) {
        case Actions.PAGE_MAIN:
            return Actions.PAGE_MAIN;
        case Actions.PAGE_SIGN:
            return Actions.PAGE_SIGN;
        default:
            return state;
    }
};

export default page;