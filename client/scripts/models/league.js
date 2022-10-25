class League {

    static async getLeagueNewData(leagueId) {
        try {
            const response = await
                fetch(`https://football-web-pages1.p.rapidapi.com/fixtures-results.json?comp=${leagueId}`, {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '', // code by request (watch README)
                        'X-RapidAPI-Host': 'football-web-pages1.p.rapidapi.com'
                    }
                });

            if (response.status >= 200 && response.status < 300) {

                return await response.json();
            } else {
                throw new Error('Data receiving error');
            }
        } catch (ex) {
            alert(ex.message);
        }
    }
}

export default League;