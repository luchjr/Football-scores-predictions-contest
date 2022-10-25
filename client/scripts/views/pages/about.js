import Component from '../../views/component';

class About extends Component {
    static async getData() {
        const userId = sessionStorage.getItem('username');
        if (userId) {
            location.hash = `/about/${userId}`;
        }
    }

    static async render() {
        return `
            <div class="access-wrapper"> 
                <img class="logo-major" src="icons/logo_01_38.png" alt="logo major">
                <div class="access">
                    <h1 class="page-title">Welcome!</h1>                   
                    <p class="access__info">
                        This is an application - a football match prediction contest.<br>
                        Register, subscribe to leagues, make predictions and compete with other participants.<br>
                        Become a better predictor. Good luck!
                    </p>
                </div>
            </div>
            `;
        }
}

export default About;