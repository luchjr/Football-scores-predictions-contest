import Component from '../../views/component';

class Error404 extends Component {
    static async render() {
        return `   
            <div class="access-wrapper">
                <img class="logo-major" src="icons/logo_01_38.png" alt="logo text">
                <div class="access">
                    <h1 class="page-title">404 Error</h1>
                    <h3 class="page-subtitle">Page not found</h3>
                </div>
            </div>          
        `;
    }
}

export default Error404;