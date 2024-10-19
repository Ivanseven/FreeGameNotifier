export const FilterModeOptions = {
    INCLUDE:"include",
    EXCLUDE:"exclude"
}

export const DefaultPostTypes ={
    game: true,
    dlc: true,
    membership: true,
    credits: true,
    prerelease: true,
    others: true
}

export const PostType = {
    // PSAs are not included as they have no PostType tag
    game:"game",
    dlc:"dlc",
    membership:"membership",
    credit:"credits",
    "alpha/beta":"prerelease",
    alpha:"prerelease",
    beta:"prerelease",
    other:"others", // Usually in-game items
}



