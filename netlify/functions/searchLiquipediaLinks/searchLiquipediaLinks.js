const { chromium } = require('playwright-core');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  let browser;
  try {
    const { searchTerm, gameType } = event.queryStringParameters;
    
    if (!searchTerm) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Search term is required' }),
      };
    }

    console.log(`Searching Liquipedia directly for: ${searchTerm} (${gameType})`);
    
    const result = await searchLiquipediaDirectly(searchTerm, gameType);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          searchTerm,
          url: result.url,
          title: result.title
        }
      }),
    };
  } catch (error) {
    console.error('Error searching Liquipedia:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to search Liquipedia',
        details: error.message 
      }),
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

async function searchLiquipediaDirectly(searchTerm, gameType) {
  // Map game types to Liquipedia paths
  const gameMapping = {
    'lol': 'leagueoflegends',
    'league of legends': 'leagueoflegends',
    'counter-strike': 'counterstrike',
    'cs:go': 'counterstrike',
    'cs2': 'counterstrike',
    'dota 2': 'dota2',
    'dota2': 'dota2',
    'valorant': 'valorant',
    'rainbow 6 siege': 'rainbowsix',
    'r6': 'rainbowsix',
    'rocket league': 'rocketleague',
    'overwatch': 'overwatch',
    'overwatch 2': 'overwatch',
    'fortnite': 'fortnite',
    'apex legends': 'apexlegends',
    'call of duty': 'callofduty',
    'cod': 'callofduty',
    'fifa': 'fifa',
    'free fire': 'freefire'
  };
  
  const gamePath = gameMapping[gameType?.toLowerCase()] || 'leagueoflegends';
  const liquipediaBaseUrl = `https://liquipedia.net/${gamePath}/`;
  
  let browser;
  let page;
  
  try {
    console.log(`Accessing Liquipedia ${gamePath} directly...`);
    
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    // Navigate to the game's Liquipedia page
    console.log(`Navigating to: ${liquipediaBaseUrl}`);
    await page.goto(liquipediaBaseUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait for the search box to be available
    await page.waitForSelector('input[name="search"]', { timeout: 10000 });
    
    // Type the search term
    console.log(`Searching for: ${searchTerm}`);
    await page.fill('input[name="search"]', searchTerm);
    
    // Submit the search
    await page.press('input[name="search"]', 'Enter');
    
    // Wait for search results or redirect
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Give time for any redirects
    
    // Check current URL and extract information
    const currentUrl = page.url();
    console.log(`Result URL: ${currentUrl}`);
    
    // If we're redirected directly to a page (not search results), that's our answer
    if (!currentUrl.includes('Special:Search')) {
      // We found a direct match!
      const pageTitle = await page.title();
      const cleanTitle = pageTitle.replace(' - Liquipedia Dota 2 Wiki', '')
                                   .replace(' - Liquipedia', '')
                                   .replace(' Wiki', '');
      
      console.log(`Direct match found: ${cleanTitle}`);
      return {
        url: currentUrl,
        title: cleanTitle || searchTerm
      };
    }
    
    // If we're on search results page, get the first result
    const firstResult = await page.evaluate(() => {
      // Look for search result links
      const searchResults = document.querySelectorAll('.mw-search-result-heading a, .searchresult a, .mw-search-result a');
      
      if (searchResults.length > 0) {
        const firstLink = searchResults[0];
        return {
          url: firstLink.href,
          title: firstLink.textContent.trim()
        };
      }
      
      return null;
    });
    
    if (firstResult) {
      console.log(`Search result found: ${firstResult.title}`);
      return {
        url: firstResult.url,
        title: firstResult.title
      };
    }
    
    // No results found
    console.log('No search results found');
    return {
      url: `${liquipediaBaseUrl}Special:Search?search=${encodeURIComponent(searchTerm)}`,
      title: `Buscar "${searchTerm}" na Liquipedia`
    };
    
  } catch (error) {
    console.error('Error during Liquipedia search:', error);
    
    // Fallback to search URL
    return {
      url: `${liquipediaBaseUrl}Special:Search?search=${encodeURIComponent(searchTerm)}`,
      title: `Buscar "${searchTerm}" na Liquipedia`
    };
  } finally {
    if (page) {
      await page.close().catch(console.error);
    }
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}