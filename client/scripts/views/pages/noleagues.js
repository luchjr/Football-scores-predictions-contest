import Component from '../../views/component';

class NoLeagues extends Component {
    static async render() {
        return `
            <div class="access-wrapper">
                <img class="logo-major" src="icons/logo_01_38.png" alt="logo text">
                <div class="access">
                    <h3 class="page-subtitle">You are not in any league</h3>
                    <h1 class="page-title">
                    <a href="#/manage-leagues/${this.urlParts.userId}">Join a league</a><h3>              
                </div>
            </div>                                
            `;
        }
}

export default NoLeagues;