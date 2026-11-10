import newAPI from './News';

const API_KEY = '920deb9f754348c0bec4871fef36d971';
const REGIONAL_SEARCH = {
    cn: {
        q: 'China',
        language: 'en',
        domains: 'globaltimes.cn,chinadaily.com.cn,scmp.com'
    },
    jp: {
        q: 'Japan',
        language: 'en'
    },
    nz: {
        q: 'latest',
        domains: 'rnz.co.nz,stuff.co.nz,nzherald.co.nz'
    }
};

function assertSuccessfulResponse(response) {
    if (response.data.status !== 'ok') {
        throw new Error(response.data.message || 'The news service returned an error.');
    }
}

export default async function getCountryNews(countryCode) {
    let response = await newAPI.get('top-headlines', {
        params: { country: countryCode, apiKey: API_KEY }
    });
    assertSuccessfulResponse(response);

    let articles = Array.isArray(response.data.articles) ? response.data.articles : [];
    if (articles.length > 0) return articles;

    const sourceResponse = await newAPI.get('top-headlines/sources', {
        params: { country: countryCode, apiKey: API_KEY }
    });
    assertSuccessfulResponse(sourceResponse);

    const sourceIds = (sourceResponse.data.sources || [])
        .map((source) => source.id)
        .filter(Boolean);

    if (sourceIds.length > 0) {
        response = await newAPI.get('everything', {
            params: {
                sources: sourceIds.slice(0, 20).join(','),
                sortBy: 'publishedAt',
                pageSize: 20,
                apiKey: API_KEY
            }
        });
    } else {
        const regionalSearch = REGIONAL_SEARCH[countryCode] || {
            q: countryCode,
            language: 'en'
        };
        response = await newAPI.get('everything', {
            params: {
                ...regionalSearch,
                sortBy: 'publishedAt',
                pageSize: 20,
                apiKey: API_KEY
            }
        });
    }

    assertSuccessfulResponse(response);
    return Array.isArray(response.data.articles) ? response.data.articles : [];
}
