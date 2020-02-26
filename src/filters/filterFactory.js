import HighPriorityFilter from './highPriorityFilter.js'
import CompleteFilter from './completeFilter.js'

const filter = { HighPriorityFilter, CompleteFilter };

export default {
    createFilter(type, attributes) {
        const FilterType = filter[type];
        return new FilterType(attributes);
    }
};