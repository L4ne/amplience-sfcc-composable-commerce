/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Box, Flex, Heading, Stack, Image, useMultiStyleConfig} from '@chakra-ui/react'
import Button from '../button'
import {getImageUrl} from '../../../utils/amplience/image'

const Hero = ({
                  title,
                  img,
                  actions,
                  textAlign = 'Left',
                  justifyContent = 'Left',
                  alignItems = 'Center',
                  fullWidth = false,
                  variant,
                  ...props
              }) => {
    const styles = useMultiStyleConfig('Hero', {variant: variant || (fullWidth && 'full')})
    let src = ''
    let alt = ''
    if (img) {
        src = getImageUrl(img.image)
        alt = img.alt
    }

    return (
        <Box
            {...styles.container}
            {...props}
        >
            <Stack
                {...styles.stackContainer}
                justifyContent={justifyContent.toLowerCase()}
                alignItems={alignItems.toLowerCase()}
            >
                <Stack {...styles.textContainer} textAlign={{base: 'center', md: textAlign.toLowerCase()}}
                       position={fullWidth ? 'absolute' : ''}>
                    <Heading
                        as="h1"
                        fontSize={{base: '2xl', md: '5xl', lg: '6xl'}}
                        maxWidth={{base: 'full', md: '75%'}}
                        {...styles.heading}
                    >
                        {title}
                    </Heading>

                    {actions && (
                        <Box maxWidth={{base: 'full', md: '75%'}}>
                            {actions.map((props, ind) => (
                                <Button key={ind} label={props.label} url={props.url}></Button>
                            ))}
                        </Box>
                    )}
                </Stack>
                {src && (
                    <Flex
                        {...styles.imageContainer}
                    >
                        <Box position={'relative'} width={'full'}>
                            <Image
                                fit={'cover'}
                                align={'center'}
                                width={'100%'}
                                height={'100%'}
                                src={src}
                                alt={alt}
                            />
                        </Box>
                    </Flex>
                )}
            </Stack>
        </Box>
    )
}

Hero.displayName = 'Hero'

Hero.propTypes = {
    /**
     * Hero component image
     */
    img: PropTypes.shape({
        image: PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            endpoint: PropTypes.string,
            defaultHost: PropTypes.string
        }),
        alt: PropTypes.string
    }),
    /**
     * Hero component main title
     */
    title: PropTypes.string,
    /**
     * Call to action component(s)
     */
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            url: PropTypes.string
        })
    ),
    /**
     * Hero button label
     */
    label: PropTypes.string,
    /**
     * Hero button url
     */
    url: PropTypes.string
}

export default Hero
