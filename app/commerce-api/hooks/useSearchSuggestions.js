/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {useState, useContext} from 'react'
import {useIntl} from 'react-intl'
import {useCommerceAPI} from '../contexts'
import {AmplienceContext} from '../../contexts/amplience'

/**
 * Hook for retrieving and managing state of Search Suggestions
 */
const useSearchSuggestions = () => {
    const api = useCommerceAPI()
    const {locale} = useIntl()
    const {client} = useContext(AmplienceContext)
    const [state, setState] = useState({results: {}})
    return {
        ...state,
        /**
         * Retrieves search suggestions from api based on input
         *
         * @param {input} string
         */
        async getSearchSuggestions(input) {
            setState({loading: true})
            const searchSuggestions = await api.shopperSearch.getSearchSuggestions({
                parameters: {
                    q: input
                }
            })

            // Filter Amplience pages
            const allPages = await client.getContentPages()
            const pageSuggestions = allPages
                .filter(item => {
                    const titles = item.content?.seo?.title?.values
                    const title = titles.filter(text => text.locale == locale)[0]
                    if (title) {
                        return title.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } else {
                        return false
                    }
                })
                .map(item => {
                    const titles = item.content?.seo?.title?.values
                    const title = titles.filter(text => text.locale == locale)[0]
                    return {
                        id: item.content?._meta?.deliveryKey,
                        name: title.value,
                        link: `/page/${item.content?._meta?.deliveryKey}`

                    }
                })

            // Add Amplience pages as custom suggestions
            searchSuggestions.customSuggestions = {
                customSuggestions: pageSuggestions
            }

            setState({results: searchSuggestions})
        },
        /**
         * Clears results
         */
        async clearSuggestedSearch() {
            setState({results: {}})
        }
    }
}

export default useSearchSuggestions
