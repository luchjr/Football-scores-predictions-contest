import Component from '../../views/component';

class Notsignedin extends Component {
    static async render() {
        return `   
            <div class="access-wrapper">
                <img class="logo-major" src="icons/logo_01_38.png" alt="logo text">
                <div class="access">
                    <h3 class="page-subtitle">You are not signed in</h3>
                    <h1 class="page-title"><a href="#/login">Sign in</a></h1>
                </div>
            </div>          
        `;
    }
}

export default Notsignedin;