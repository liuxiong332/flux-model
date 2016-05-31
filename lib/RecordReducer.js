import Record from './Record'
import ReducerMixin from './ReducerMixin'

export default (defaultValues) => ReducerMixin(Record(defaultValues));
