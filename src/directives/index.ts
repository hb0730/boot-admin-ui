import type { Directive } from 'vue'
import auth from './modules/auth'

const directivesList: { [key: string]: Directive } = {
  auth,
}

export default directivesList
