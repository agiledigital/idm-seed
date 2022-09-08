// Dynamically load the additional TypeScript policies
var additionalPolicies = require('additionalPolicy');

// Bring the policy functions into this scope, otherwise `policy.js` won't find the functions.
// The idea behind keeping the functions in a separate file is so that the function definitions can be reloaded when they change, as this
// file is cached in the policy.json service until it is reloaded or IDM is restarted.
maximumArrayLength = additionalPolicies.maximumArrayLength;
enumValue = additionalPolicies.enumValue;
passwordHistory = additionalPolicies.passwordHistory;
addsPasswordComplexity = additionalPolicies.addsPasswordComplexity;

// Register the policies using the addPolicy function
additionalPolicies.registerAdditionalPolicies(addPolicy);
