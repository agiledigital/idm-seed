import idm, { ManagedUser } from "lib/idm"
import { getLogger, hasPlatformProvisioningRole } from "./common"
import { findUserByUserName, MAXIMUM_PASSWORD_HISTORY } from "./user"

declare const request: PolicyRequest
declare const context: RequestContext

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger("seed.script.additionalPolicy")

/**
 * This password is used by the platform-ui as a test password to discover all the password criteria
 */
const TEST_PASSWORD = "aaa"

const isNonEmptyString = (value: string): boolean => typeof value === "string" && value.length > 0

const supplyDefaults = <T extends Record<string, any>>(supplied: T, defaults: Required<T>): Required<T> => ({ ...defaults, ...supplied })

function maximumArrayLengthPolicy(): Policy {
  return {
    policyId: "maximumArrayLength",
    policyExec: "maximumArrayLength",
    policyRequirements: ["MAXIMUM_ARRAY_LENGTH"],
    validateOnlyIfPresent: true,
  }
}

type MaximumArrayLengthParams = {
  maximumItems: string
  typeName: string
}

export function maximumArrayLength(
  fullObject: Record<string, any>,
  value: Array<unknown> | undefined,
  params: MaximumArrayLengthParams
): PolicyRequirement[] {
  const arrayLength = value?.length ?? 0
  if (arrayLength > parseInt(params.maximumItems)) {
    return [
      {
        policyRequirement: "MAXIMUM_ARRAY_LENGTH",
        params: { arrayLength: arrayLength, ...params },
      },
    ]
  }
  return []
}

function enumValuePolicy(): Policy {
  return {
    policyId: "enumValue",
    policyExec: "enumValue",
    policyRequirements: ["ENUM_VALUE"],
    validateOnlyIfPresent: true,
  }
}

type EnumValueParams = {
  values: string[]
}

export function enumValue(fullObject: unknown, value: string | undefined, params: EnumValueParams): PolicyRequirement[] {
  if ((value?.length ?? 0) > 0 && !params.values.includes(value ?? "")) {
    return [
      {
        policyRequirement: "ENUM_VALUE",
        params: { allowedValues: params.values.join(", ") },
      },
    ]
  }
  return []
}

function lookupUser(request: PolicyRequest, fullObject: any): ManagedUser | null {
  // Don't lookup the user if the resource is not a managed/user object or ends with "/*",
  // which indicates that this is a create with a server-supplied id
  const managedUserRegex = /^managed\/user(?:\/(.{2,}|([^*])))?$/
  const managedUserMatch = managedUserRegex.exec(request.resourcePath)
  if (managedUserMatch?.[1]) {
    return idm.managed.user.read(managedUserMatch[1])
  } else if (managedUserMatch?.[0] && fullObject.userName) {
    // If we didn't find the managed user id, then that probably means that it is a "validateProperty" action, in which case we can lookup the object by username
    return findUserByUserName(fullObject.userName, true) ?? null
  }

  return null
}

function passwordHistoryPolicy(): Policy {
  return {
    policyId: "passwordHistory",
    policyExec: "passwordHistory",
    policyRequirements: ["PASSWORD_HISTORY"],
    validateOnlyIfPresent: true,
  }
}

export function passwordHistory(fullObject: any, value: string | undefined): PolicyRequirement[] {
  // Show this policy requirement for the platform ui test
  if (value === TEST_PASSWORD) {
    return [
      {
        policyRequirement: "PASSWORD_HISTORY",
      },
    ]
  }

  // We only check password history if it comes via self-service password reset or account activation, which only happens with platform-provisioning role
  // This means admins and password syncs aren't subject to password history
  if (value && (value?.length ?? 0) > 0 && hasPlatformProvisioningRole(context)) {
    const currentObject = lookupUser(request, fullObject)

    // Don't enforce this policy if the resource being evaluated wasn't found. Happens in the case of a create with a
    // client-supplied id.
    if (currentObject === null) {
      return []
    }

    // If we have no password history then there is nothing to do
    if (!currentObject.passwordHistory) {
      return []
    }

    const numPasswdHistory = currentObject.passwordHistory.length

    // Check if the current password matches any previous passwords
    for (let i = numPasswdHistory; i >= numPasswdHistory - MAXIMUM_PASSWORD_HISTORY && i >= 0; i--) {
      const curPassHistory = currentObject.passwordHistory[i]
      if (curPassHistory && openidm.isHashed(curPassHistory) && openidm.matches(value, curPassHistory)) {
        return [
          {
            policyRequirement: "PASSWORD_HISTORY",
          },
        ]
      }
    }
  }
  return []
}

function addsPasswordComplexityPolicy(): Policy {
  return {
    policyId: "addsPasswordComplexity",
    policyExec: "addsPasswordComplexity",
    policyRequirements: ["AT_LEAST_LOWERCASE_LETTERS", "AT_LEAST_UPPERCASE_LETTERS", "AT_LEAST_DIGITS", "AT_LEAST_SPECIAL"],
    validateOnlyIfPresent: true,
  }
}

export function addsPasswordComplexity(fullObject: any, value: string | undefined): PolicyRequirement[] {
  const characterPolicies = ["AT_LEAST_LOWERCASE_LETTERS", "AT_LEAST_UPPERCASE_LETTERS", "AT_LEAST_DIGITS", "AT_LEAST_SPECIAL"]
  // If we get the test password then we should fail all categories, otherwise categories may be missing depending on the test password
  if (value === TEST_PASSWORD) {
    return characterPolicies.map((p) => {
      return { policyRequirement: p }
    })
  }
  if (value && (value?.length ?? 0) > 0) {
    const characterSets = [/[a-z]/, /[A-Z]/, /[0-9]/, /[~!@#$%^&*()\-_=+[\]{}|;:,.<>/?"'\\`]/]
    const policyFailures: PolicyRequirement[] = []
    for (let i = 0; i < characterSets.length; i++) {
      if (!characterSets[i].test(value)) {
        policyFailures.push({ policyRequirement: characterPolicies[i] })
      }
    }
    // We only need 3 out of 4 categories which translates to more than 1 failure.
    if (policyFailures.length > 1) {
      return policyFailures
    }
  }
  return []
}

export function registerAdditionalPolicies(addPolicy: Function): void {
  addPolicy(maximumArrayLengthPolicy())
  addPolicy(enumValuePolicy())
  addPolicy(passwordHistoryPolicy())
  addPolicy(addsPasswordComplexityPolicy())
}
