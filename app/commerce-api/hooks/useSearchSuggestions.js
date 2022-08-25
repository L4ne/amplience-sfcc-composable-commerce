/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {useState, useContext} from 'react'
import {useCommerceAPI} from '../contexts'
import {AmplienceContext} from '../../contexts/amplience'

/**
 * Hook for retrieving and managing state of Search Suggestions
 */
const useSearchSuggestions = () => {
    const api = useCommerceAPI()
    const {client} = useContext(AmplienceContext)
    const [state, setState] = useState({results: {}})
    const [allPages, setAllPages] = useState([])
    console.log("ALL PAGES:", allPages)
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
            const allPagesResult = await client.getContentPages()
            setAllPages(allPagesResult)

            const customSuggestions = allPagesResult.map(content => {
                return {
                    id: "faq",
                    name: "Faq",
                    link: "/page/faq"
                }
            })

            searchSuggestions.customSuggestions = {
                customSuggestions:[
                    {
                        id: "faq",
                        name: "Faq",
                        link: "/page/faq"
                    },
                    {
                        id: "faq2",
                        name: "Faq 2",
                        link: "/page/faq"
                    }
                ]
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
