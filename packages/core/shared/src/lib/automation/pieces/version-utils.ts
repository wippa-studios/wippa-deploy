import semverMajor from 'semver/functions/major'
import semverMinor from 'semver/functions/minor'
import semverMinVersion from 'semver/ranges/min-version'

export const getPieceMajorAndMinorVersion = (connectorVersion: string): string => {
    const minimumSemver = semverMinVersion(connectorVersion)
    return minimumSemver
        ? `${semverMajor(minimumSemver)}.${semverMinor(minimumSemver)}`
        : `${semverMajor(connectorVersion)}.${semverMinor(connectorVersion)}`
}
