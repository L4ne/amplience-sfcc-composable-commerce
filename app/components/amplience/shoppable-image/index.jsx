import React from 'react'
import PropTypes from 'prop-types'
import Link from '../link'
import {
    Box,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Image,
    Tooltip,
    useDisclosure
} from '@chakra-ui/react'
import {categoryUrlBuilder, productUrlBuilder} from '../../../utils/url'
import {getImageUrl} from '../../../utils/amplience/image'
import {useCategories} from '../../../hooks/use-categories'
import {useRef} from 'react'
import {useState} from 'react'
import {useEffect} from 'react'
import useResizeObserver from '@react-hook/resize-observer'
import {useLayoutEffect} from 'react'
import styled from '@emotion/styled'
import AmplienceWrapper from '../wrapper'
import {useCommerceAPI} from '../../../commerce-api/contexts'
import {useIntl} from 'react-intl'

const Contain = styled(Box)`
    .interactive {
        transition: border-width 0.3s;
        border: 0px solid white;
        cursor: pointer;
    }

    .interactive:hover {
        border-width: 3px;
    }
`

const Polygon = styled(Box)`
    @keyframes gradient {
        0% {
            background-position: 0% 0%;
        }
        40% {
            background-position: 10% 10%;
        }
        60% {
            background-position: 90% 90%;
        }
        100% {
            background-position: 100% 100%;
        }
    }

    background: linear-gradient(
        -45deg,
        transparent,
        transparent,
        rgba(255, 255, 255, 0.35),
        transparent,
        transparent
    );
    background-size: 400% 400%;
    animation: gradient 7s ease infinite;
`

const ShoppableImageInteractable = ({target, selector, tooltips, tooltipPlacement, children}) => {
    const matchTooltip = tooltips?.find((tooltip) => tooltip.key === target)

    const {isOpen, onOpen, onClose} = useDisclosure()
    const tProps = {placement: tooltipPlacement ?? 'bottom'}

    let defaultTooltip = target
    switch (selector) {
        case 'product':
            defaultTooltip = 'Loading...'
            break
        case 'category': {
            const {categories} = useCategories()
            defaultTooltip = categories[target]?.name ?? target
            break
        }
        case 'contentKey':
            defaultTooltip = 'Click to open...'
            break
    }

    const [tooltip, setTooltip] = useState(defaultTooltip)

    const label = matchTooltip?.value ?? tooltip

    switch (selector) {
        case 'product': {
            const api = useCommerceAPI()
            const intl = useIntl()

            useEffect(() => {
                let useResult = true

                api.shopperProducts
                    .getProduct({
                        parameters: {
                            id: target,
                            allImages: true
                        }
                    })
                    .then((product) => {
                        if (useResult) {
                            setTooltip(
                                `${product.name} - ${intl.formatNumber(product.price, {
                                    style: 'currency',
                                    currency: product.currency
                                })}`
                            )
                        }
                    })

                return () => (useResult = false)
            }, [target])

            return (
                <Link to={productUrlBuilder({id: target})}>
                    <Tooltip label={label} {...tProps}>
                        {children}
                    </Tooltip>
                </Link>
            )
        }
        case 'category': {
            return (
                <Link to={categoryUrlBuilder({id: target})}>
                    <Tooltip label={label} {...tProps}>
                        {children}
                    </Tooltip>
                </Link>
            )
        }
        case 'link': {
            let link
            if (/^https?:\/\/|^\/\//i.test(target)) {
                link = '$' + target
            } else {
                link = target
            }
            return (
                <Link to={link}>
                    <Tooltip label={label} {...tProps}>
                        {children}
                    </Tooltip>
                </Link>
            )
        }
        case 'page':
            // TODO: get page name?
            return (
                <Link to={'/page/' + target}>
                    <Tooltip label={label} {...tProps}>
                        {children}
                    </Tooltip>
                </Link>
            )
        case 'tooltip': {
            if (matchTooltip) {
                return (
                    <Tooltip label={matchTooltip.value} {...tProps}>
                        {children}
                    </Tooltip>
                )
            }

            return <>{children}</>
        }
        case 'contentKey':
            return (
                <>
                    <Link
                        to="#"
                        onClick={(evt) => {
                            onOpen()
                            evt.preventDefault()
                            return false
                        }}
                    >
                        <Tooltip label={matchTooltip?.value ?? 'Click to open...'} {...tProps}>
                            {children}
                        </Tooltip>
                    </Link>
                    <Drawer onClose={onClose} isOpen={isOpen} size="xl">
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerBody>
                                <DrawerCloseButton />
                                {matchTooltip?.value && (
                                    <DrawerHeader>{matchTooltip?.value}</DrawerHeader>
                                )}
                                <AmplienceWrapper fetch={{key: target}}></AmplienceWrapper>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </>
            )
        default:
            return <>{children}</>
    }
}

ShoppableImageInteractable.propTypes = {
    target: PropTypes.string,
    selector: PropTypes.string,
    tooltips: PropTypes.array,
    tooltipPlacement: PropTypes.string,
    children: PropTypes.node
}

const getBounds = (points) => {
    let minX = Infinity
    let minY = Infinity

    let maxX = -Infinity
    let maxY = -Infinity

    for (let point of points) {
        minX = Math.min(minX, point.x)
        minY = Math.min(minY, point.y)

        maxX = Math.max(maxX, point.x)
        maxY = Math.max(maxY, point.y)
    }

    return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY
    }
}

const ShoppableImage = ({
    shoppableImage,
    imageAltText,
    seoText,
    tooltips,
    width,
    height,
    rows,
    cols,
    gap,
    ...props
}) => {
    const target = useRef(null)
    const [size, setSize] = useState()
    const [imageSize, setImageSize] = useState()

    useLayoutEffect(() => {
        setSize(target.current.getBoundingClientRect())
    }, [target])

    useResizeObserver(target, (entry) => setSize(entry.contentRect))

    useEffect(async () => {
        let cancelled = false

        // Determine the image size.
        let response = await fetch(getImageUrl(shoppableImage.image) + '.json')

        if (cancelled) return

        let json = await response.json()

        if (cancelled) return

        setImageSize({width: json.width, height: json.height})

        return () => {
            cancelled = true
        }
    }, [shoppableImage.image])

    const elements = []

    const imageStyle = {
        position: 'absolute',
        display: 'none',
        maxWidth: 'initial'
    }

    if (size && imageSize) {
        const containerAspect = size.width / size.height
        const imageAspect = imageSize.width / imageSize.height

        imageStyle.display = 'block'

        const scaleToFit = shoppableImage.poi == null || shoppableImage.poi.x === -1
        let imgSize

        // Scale to fit wants to scale the largest overflowing dimension down to fit within the canvas,
        // POI cover is the opposite - scale the smallest dimension up to fit.

        const fitW = scaleToFit ^ (imageAspect < containerAspect)

        if (fitW) {
            imgSize = [size.width, size.width / imageAspect]
        } else {
            imgSize = [size.height * imageAspect, size.height]
        }

        imageStyle.width = `${imgSize[0]}px`
        imageStyle.height = `${imgSize[1]}px`

        // Attempt to center the image with respect to POI.

        const poi = scaleToFit ? {x: 0.5, y: 0.5} : shoppableImage.poi

        let imgPosition

        if (scaleToFit) {
            imgPosition = [(size.width - imgSize[0]) / 2, (size.height - imgSize[1]) / 2]
        } else {
            const overflowX = Math.abs(imgSize[0] - size.width)
            const overflowY = Math.abs(imgSize[1] - size.height)

            imgPosition = [
                Math.max(-overflowX, Math.min(0, size.width / 2 - imgSize[0] * poi.x)),
                Math.max(-overflowY, Math.min(0, size.height / 2 - imgSize[1] * poi.y))
            ]
        }

        const sX = (x) => x * imgSize[0]
        const sY = (y) => y * imgSize[1]
        const tX = (x) => x * imgSize[0] + imgPosition[0]
        const tY = (y) => y * imgSize[1] + imgPosition[1]

        const transformBounds = (bounds) => ({
            x: tX(bounds.x),
            y: tY(bounds.y),
            w: sX(bounds.w),
            h: sY(bounds.h)
        })

        imageStyle.transform = `translate(${imgPosition[0]}px, ${imgPosition[1]}px)`
        const minDim = Math.min(size.width, size.height)

        const hotspotSize = minDim / 8

        const polyStyle = {
            position: 'absolute',
            borderRadius: '10px'
        }

        const hotspotStyle = {
            position: 'absolute',
            width: `${hotspotSize}px`,
            height: `${hotspotSize}px`,
            borderRadius: `${hotspotSize / 2}px`,
            margin: `${hotspotSize / -2}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }

        if (shoppableImage.polygons) {
            for (let poly of shoppableImage.polygons) {
                const bounds = transformBounds(getBounds(poly.points))

                const style = {
                    width: `${bounds.w}px`,
                    height: `${bounds.h}px`,
                    transform: `translate(${bounds.x}px, ${bounds.y}px)`
                }

                if (poly.points.length > 5) {
                    style.borderRadius = '100%'
                }

                const tooltipPlacement = bounds.y + bounds.h > size.height ? 'top' : 'bottom'

                elements.push(
                    <ShoppableImageInteractable
                        {...poly}
                        tooltips={tooltips}
                        tooltipPlacement={tooltipPlacement}
                        key={poly.id}
                    >
                        <Polygon
                            {...polyStyle}
                            {...style}
                            className="interactive"
                            style={{animationDelay: `${(bounds.x + bounds.y) * 0.3}s`}}
                        />
                    </ShoppableImageInteractable>
                )
            }
        }

        const Svg = styled('svg')`
            transform: scale(${(hotspotSize - 6) / 300});
            width: 260px;
            height: 260px;
            margin: -130px;
            transition: transform 0.5s, fill 0.3s;

            &:hover {
                transform: rotate(90deg) scale(${(hotspotSize - 6) / 260});
                fill: #0040c0;
            }
        `

        if (shoppableImage.hotspots) {
            for (let hotspot of shoppableImage.hotspots) {
                const point = hotspot.points

                const transform = `translate(${tX(point.x)}px, ${tY(point.y)}px)`

                elements.push(
                    <ShoppableImageInteractable {...hotspot} tooltips={tooltips} key={hotspot.id}>
                        <Box {...hotspotStyle} transform={transform} className="interactive">
                            <Svg>
                                <circle cx="130" cy="130" r="130" fill="rgba(255, 255, 255, 0.5)" />
                                <path
                                    d="M 110 32 C 70.8169 39.9535 39.9535 70.8169 32 110 L 52.5 110 C 59.735 81.8817 81.8869 59.7356 110 52.5 L 110 32 ZM 228 110 C 220.0465 70.8169 189.1831 39.9535 150 32 L 150 52.5 C 178.1131 59.7356 200.2651 81.8817 207.5 110 L 228 110 ZM 150 228 C 189.1831 220.0465 220.0465 189.1831 228 150 L 207.5 150 C 200.2651 178.1183 178.1131 200.2644 150 207.5 L 150 228 ZM 32 150 C 39.9535 189.1831 70.8169 220.0465 110 228 L 110 207.5 C 81.8869 200.2644 59.7349 178.1183 52.5 150 L 32 150 Z"
                                    fill="#000000"
                                />
                                <rect x="120" y="0" width="20" height="90" />
                                <rect x="120" y="170" width="20" height="90" />
                                <rect x="0" y="120" width="90" height="20" />
                                <rect x="170" y="120" width="90" height="20" />
                                <path
                                    d="M 110 130 C 110 118.9542 118.9542 110 130 110 C 141.0458 110 150 118.9542 150 130 C 150 141.0458 141.0458 150 130 150 C 118.9542 150 110 141.0458 110 130 ZM 100 130 C 100 146.5688 113.4312 160 130 160 C 146.5688 160 160 146.5688 160 130 C 160 113.4312 146.5688 100 130 100 C 113.4312 100 100 113.4312 100 130 Z"
                                    fill="#000000"
                                />
                                <path
                                    id="Ellipse"
                                    d="M 120 130 C 120 124.4771 124.4771 120 130 120 C 135.5229 120 140 124.4771 140 130 C 140 135.5229 135.5229 140 130 140 C 124.4771 140 120 135.5229 120 130 Z"
                                />
                            </Svg>
                        </Box>
                    </ShoppableImageInteractable>
                )
            }
        }
    }

    const cardtransformations = {
        width: 1200,
        quality: 80,
        upscale: false
    }

    props.width = width ?? '100%'

    if (cols && rows && gap && size) {
        // Force the height to a fraction of the width (minus gap)
        props.height = (rows * (size.width - gap * (cols - 1))) / cols + (rows - 1) * gap + 'px'
    } else if (height) {
        props.height = height
    } else {
        props.minHeight = '600px'
    }

    // Determine a transformation to use given the current image scale.

    const imageUrl = getImageUrl(shoppableImage.image)

    return (
        <Contain {...props} ref={target} overflow="hidden" position="relative">
            <Image src={imageUrl} {...imageStyle} alt={imageAltText}></Image>
            {elements}
        </Contain>
    )
}

ShoppableImage.displayName = 'ShoppableImage'

ShoppableImage.propTypes = {
    shoppableImage: PropTypes.object,
    imageAltText: PropTypes.string,
    seoText: PropTypes.string,
    tooltips: PropTypes.array,

    width: PropTypes.string,
    height: PropTypes.string,
    rows: PropTypes.number,
    cols: PropTypes.number,
    gap: PropTypes.number
}

export default ShoppableImage
