const algoliasearch = require("algoliasearch");

const createAlgoliaIndex = async () => {
  const client = algoliasearch.default(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );


  return client.initIndex(process.env.ALGOLIA_INDEX_NAME);
};

module.exports = createAlgoliaIndex;
