import React, {useState} from 'react';
import Navigation from './Navigation/Navigation';
import { TokenContext, UsernameContext } from './Context/Context'


export default function App () {

const [token, setToken] = useState(null)
const [username, setUsername] = useState(null)
console.log('token', token)

return (
<UsernameContext.Provider value={[username, setUsername]}>
  <TokenContext.Provider value={[token, setToken]}>
     <Navigation />
  </TokenContext.Provider>
</UsernameContext.Provider>
)
}


