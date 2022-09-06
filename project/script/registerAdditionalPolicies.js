var additionalPolicies = require('additionalPolicy');

maximumArrayLength = additionalPolicies.maximumArrayLength;
enumValue = additionalPolicies.enumValue;
passwordHistory = additionalPolicies.passwordHistory;
addsPasswordComplexity = additionalPolicies.addsPasswordComplexity;

additionalPolicies.registerAdditionalPolicies(addPolicy);
