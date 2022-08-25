/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {Stack} from '@chakra-ui/react'
import RecentSearches from './recent-searches'
import Suggestions from './suggestions'

const SearchSuggestions = ({recentSearches, searchSuggestions, closeAndNavigate}) => {
    const useSuggestions = searchSuggestions 
        && ( searchSuggestions?.categorySuggestions?.length > 0 
            || searchSuggestions?.productSuggestions?.length > 0 
            || searchSuggestions?.customSuggestions?.length > 0)
    return (
        <Stack padding={6} spacing={0}>
            {useSuggestions ? (
                <Fragment>
                    {
                        searchSuggestions?.categorySuggestions?.length > 0 &&
                        <>
                            {/* <b>CATEGORIES</b> */}
                            <Suggestions
                                closeAndNavigate={closeAndNavigate}
                                suggestions={searchSuggestions?.categorySuggestions}
                            />
                        </>
                    }
                    {
                        searchSuggestions?.productSuggestions?.length &&
                        <>
                            {/* <b>PRODUCTS</b> */}
                            <Suggestions
                                closeAndNavigate={closeAndNavigate}
                                suggestions={searchSuggestions?.productSuggestions}
                            />
                        </>
                    }
                    {
                        searchSuggestions?.customSuggestions?.length > 0 &&
                        <>
                            {/* <b>PAGES</b> */}
                            <Suggestions
                                closeAndNavigate={closeAndNavigate}
                                suggestions={searchSuggestions?.customSuggestions}
                            />
                        </>
                    }
                    {/* <Suggestions
                        closeAndNavigate={closeAndNavigate}
                        suggestions={searchSuggestions?.phraseSuggestions}
                    /> */}
                    {/* <Suggestions suggestions={searchSuggestions.productSuggestions} /> */}
                </Fragment>
            ) : (
                <RecentSearches
                    recentSearches={recentSearches}
                    closeAndNavigate={closeAndNavigate}
                />
            )}
        </Stack>
    )
}

SearchSuggestions.propTypes = {
    recentSearches: PropTypes.array,
    searchSuggestions: PropTypes.object,
    closeAndNavigate: PropTypes.func
}

export default SearchSuggestions
