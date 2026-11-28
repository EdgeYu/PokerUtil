import React, { useState, useEffect, useRef } from 'react'
import PageHeading from '@components/PageHeading'
import PlayingCard from '@components/PlayingCard'
import type { CardSuit } from '@components/PlayingCard'

const toCardSuit = (suit: string): CardSuit => suit as CardSuit

interface PokerCard {
    rank: string
    suit: string
    suitSymbol: string
    isRed: boolean
    value: number
    display: string
}

// 对手可能牌型统计：每种牌型的最强牌例、该牌型出现的对手手牌组合数
interface OpponentHandTypeStat {
    handType: string
    bestCards: PokerCard[]
    bestScore: number
    count: number
}

// 坚果牌（Nuts）：当前牌面上理论最强的一手牌
interface NutsHandInfo {
    handType: string
    cards: PokerCard[]
    isMine: boolean
}

const POKER_CARDS: PokerCard[] = [
    // 黑桃 ♠
    { rank: 'A', suit: 'spades', suitSymbol: '♠', isRed: false, value: 14, display: 'A' },
    { rank: 'K', suit: 'spades', suitSymbol: '♠', isRed: false, value: 13, display: 'K' },
    { rank: 'Q', suit: 'spades', suitSymbol: '♠', isRed: false, value: 12, display: 'Q' },
    { rank: 'J', suit: 'spades', suitSymbol: '♠', isRed: false, value: 11, display: 'J' },
    { rank: '10', suit: 'spades', suitSymbol: '♠', isRed: false, value: 10, display: '10' },
    { rank: '9', suit: 'spades', suitSymbol: '♠', isRed: false, value: 9, display: '9' },
    { rank: '8', suit: 'spades', suitSymbol: '♠', isRed: false, value: 8, display: '8' },
    { rank: '7', suit: 'spades', suitSymbol: '♠', isRed: false, value: 7, display: '7' },
    { rank: '6', suit: 'spades', suitSymbol: '♠', isRed: false, value: 6, display: '6' },
    { rank: '5', suit: 'spades', suitSymbol: '♠', isRed: false, value: 5, display: '5' },
    { rank: '4', suit: 'spades', suitSymbol: '♠', isRed: false, value: 4, display: '4' },
    { rank: '3', suit: 'spades', suitSymbol: '♠', isRed: false, value: 3, display: '3' },
    { rank: '2', suit: 'spades', suitSymbol: '♠', isRed: false, value: 2, display: '2' },

    // 红心 ♥
    { rank: 'A', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 14, display: 'A' },
    { rank: 'K', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 13, display: 'K' },
    { rank: 'Q', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 12, display: 'Q' },
    { rank: 'J', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 11, display: 'J' },
    { rank: '10', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 10, display: '10' },
    { rank: '9', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 9, display: '9' },
    { rank: '8', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 8, display: '8' },
    { rank: '7', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 7, display: '7' },
    { rank: '6', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 6, display: '6' },
    { rank: '5', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 5, display: '5' },
    { rank: '4', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 4, display: '4' },
    { rank: '3', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 3, display: '3' },
    { rank: '2', suit: 'hearts', suitSymbol: '♥', isRed: true, value: 2, display: '2' },

    // 梅花 ♣
    { rank: 'A', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 14, display: 'A' },
    { rank: 'K', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 13, display: 'K' },
    { rank: 'Q', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 12, display: 'Q' },
    { rank: 'J', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 11, display: 'J' },
    { rank: '10', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 10, display: '10' },
    { rank: '9', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 9, display: '9' },
    { rank: '8', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 8, display: '8' },
    { rank: '7', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 7, display: '7' },
    { rank: '6', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 6, display: '6' },
    { rank: '5', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 5, display: '5' },
    { rank: '4', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 4, display: '4' },
    { rank: '3', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 3, display: '3' },
    { rank: '2', suit: 'clubs', suitSymbol: '♣', isRed: false, value: 2, display: '2' },

    // 方块 ♦
    { rank: 'A', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 14, display: 'A' },
    { rank: 'K', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 13, display: 'K' },
    { rank: 'Q', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 12, display: 'Q' },
    { rank: 'J', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 11, display: 'J' },
    { rank: '10', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 10, display: '10' },
    { rank: '9', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 9, display: '9' },
    { rank: '8', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 8, display: '8' },
    { rank: '7', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 7, display: '7' },
    { rank: '6', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 6, display: '6' },
    { rank: '5', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 5, display: '5' },
    { rank: '4', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 4, display: '4' },
    { rank: '3', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 3, display: '3' },
    { rank: '2', suit: 'diamonds', suitSymbol: '♦', isRed: true, value: 2, display: '2' }
]

// 花色顺序固定：选牌 tab 与牌张滑动页共用，靠 index 对齐
const SUITS = [
    { suit: 'spades', symbol: '♠', name: '黑桃', color: 'text-cream', bgColor: 'bg-cream' },
    { suit: 'hearts', symbol: '♥', name: '红心', color: 'text-red-400', bgColor: 'bg-red-500' },
    { suit: 'clubs', symbol: '♣', name: '梅花', color: 'text-cream', bgColor: 'bg-cream' },
    { suit: 'diamonds', symbol: '♦', name: '方块', color: 'text-red-400', bgColor: 'bg-red-500' }
]

const PokerAnalyzerPage: React.FC = () => {
    const [holeCards, setHoleCards] = useState<PokerCard[]>([])
    const [communityCards, setCommunityCards] = useState<PokerCard[]>([])
    const [analysisResult, setAnalysisResult] = useState<string>('')
    const [bestHand, setBestHand] = useState<string>('')
    const [bestHandCards, setBestHandCards] = useState<PokerCard[]>([])
    const [currentBestHand, setCurrentBestHand] = useState<string>('')
    const [currentBestHandCards, setCurrentBestHandCards] = useState<PokerCard[]>([])
    const [futureBestHand, setFutureBestHand] = useState<string>('')
    const [futureBestHandCards, setFutureBestHandCards] = useState<PokerCard[]>([])
    const [currentWinRate, setCurrentWinRate] = useState<string>('0.0')
    const [opponentHandStats, setOpponentHandStats] = useState<OpponentHandTypeStat[]>([])
    const [opponentHandTotal, setOpponentHandTotal] = useState<number>(0)
    // 我的当前牌型分数，用于标记「对手哪些牌型能大过我」
    const [myBestScore, setMyBestScore] = useState<number>(-1)
    // 坚果牌（当前牌面理论最强的一手牌）
    const [nutsHand, setNutsHand] = useState<NutsHandInfo | null>(null)
    // 默认收起，避免在桌面/手机上遮挡牌面与分析结果；点击右侧把手展开
    const [showFloatingPanel, setShowFloatingPanel] = useState<boolean>(false)
    const [activeSuit, setActiveSuit] = useState<string>('spades') // 默认选中黑桃
    // 悬浮窗拖拽时的横向位移（null 表示未在拖拽）
    const [panelDragX, setPanelDragX] = useState<number | null>(null)
    const cardSelectionRef = useRef<HTMLDivElement>(null)
    const suitTabsRef = useRef<HTMLDivElement>(null)
    const cardPagerRef = useRef<HTMLDivElement>(null)
    const activeSuitIndexRef = useRef(0)
    const floatingDrawerRef = useRef<HTMLDivElement>(null)
    const drawerDragRef = useRef<{ startX: number; startY: number; startTranslate: number; dragging: boolean } | null>(null)
    const drawerDragXRef = useRef(0)
    const lastDrawerDragAtRef = useRef(0)

    // 让当前选中的花色 tab 滚动到可视区中间（手机端 tab 可左右滑动）
    const scrollSuitTabIntoView = (target: HTMLButtonElement) => {
        const container = suitTabsRef.current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        // 只改变 tab 容器自身的横向滚动位置，避免带动整页滚动
        const delta = (targetRect.left + targetRect.width / 2) - (containerRect.left + container.clientWidth / 2)
        container.scrollTo({ left: container.scrollLeft + delta, behavior: 'smooth' })
    }

    // 切换花色：点击 tab 时把牌张区域翻到对应页，tab 与页面始终同步
    const selectSuit = (index: number, tabElement?: HTMLButtonElement) => {
        const suitInfo = SUITS[index]
        if (!suitInfo) return
        setActiveSuit(suitInfo.suit)
        activeSuitIndexRef.current = index
        const pager = cardPagerRef.current
        if (pager) pager.scrollLeft = index * pager.clientWidth
        if (tabElement) scrollSuitTabIntoView(tabElement)
    }

    // 牌张区域左右滑动后，按滑动位置同步当前花色和上方 tab
    const handlePagerScroll = () => {
        const pager = cardPagerRef.current
        if (!pager || pager.clientWidth === 0) return
        const index = Math.min(SUITS.length - 1, Math.max(0, Math.round(pager.scrollLeft / pager.clientWidth)))
        if (index === activeSuitIndexRef.current) return
        activeSuitIndexRef.current = index
        setActiveSuit(SUITS[index].suit)

        const container = suitTabsRef.current
        if (!container) return
        const tab = container.querySelector<HTMLButtonElement>(`button[data-suit="${SUITS[index].suit}"]`)
        if (tab) scrollSuitTabIntoView(tab)
    }

    // 悬浮窗收起后的位移量：自身宽度 + 右侧外边距
    const getDrawerClosedOffset = () => (floatingDrawerRef.current?.offsetWidth ?? 300) + 16

    // 悬浮窗侧滑：向右滑收起，收起后向左滑展开
    const handleDrawerPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        drawerDragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startTranslate: showFloatingPanel ? 0 : getDrawerClosedOffset(),
            dragging: false,
        }
    }

    const handleDrawerPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = drawerDragRef.current
        if (!drag) return
        const dx = event.clientX - drag.startX
        const dy = event.clientY - drag.startY
        if (!drag.dragging) {
            // 横向位移明显大于纵向才当作侧滑，避免影响页面纵向滚动和点击
            if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return
            drag.dragging = true
            event.currentTarget.setPointerCapture?.(event.pointerId)
        }
        const closedOffset = getDrawerClosedOffset()
        const next = Math.max(0, Math.min(closedOffset, drag.startTranslate + dx))
        drawerDragXRef.current = next
        setPanelDragX(next)
    }

    const finishDrawerDrag = (cancelled: boolean) => {
        const drag = drawerDragRef.current
        drawerDragRef.current = null
        if (drag?.dragging) {
            lastDrawerDragAtRef.current = Date.now()
            if (!cancelled) {
                // 滑过 40% 就切换状态，否则回弹
                setShowFloatingPanel(drawerDragXRef.current < getDrawerClosedOffset() * 0.4)
            }
        }
        setPanelDragX(null)
    }

    // 把手单击：刚侧滑完的短暂时间内忽略点击，避免滑动后又被点击反向切换
    const toggleFloatingPanel = () => {
        if (Date.now() - lastDrawerDragAtRef.current < 300) return
        setShowFloatingPanel(!showFloatingPanel)
    }

    // 悬浮窗默认收起，由右侧金色把手手动展开，避免遮挡牌面与分析结果

    // 转屏 / 改变窗口宽度后，牌张页宽会变，重新对齐到当前花色那一页
    useEffect(() => {
        const realignPager = () => {
            const pager = cardPagerRef.current
            if (!pager || pager.clientWidth === 0) return
            pager.scrollLeft = activeSuitIndexRef.current * pager.clientWidth
        }
        window.addEventListener('resize', realignPager)
        return () => window.removeEventListener('resize', realignPager)
    }, [])





    const addHoleCard = (card: PokerCard) => {
        if (holeCards.length < 2 && !isCardSelected(card)) {
            const newHoleCards = [...holeCards, card]
            setHoleCards(newHoleCards)
            calculateBestHand(newHoleCards, communityCards)
        }
    }

    const addCommunityCard = (card: PokerCard) => {
        if (communityCards.length < 5 && !isCardSelected(card)) {
            const newCommunityCards = [...communityCards, card]
            setCommunityCards(newCommunityCards)
            calculateBestHand(holeCards, newCommunityCards)
        }
    }

    const removeHoleCard = (index: number) => {
        const newHoleCards = holeCards.filter((_, i) => i !== index)
        setHoleCards(newHoleCards)
        calculateBestHand(newHoleCards, communityCards)
    }

    const removeCommunityCard = (index: number) => {
        const newCommunityCards = communityCards.filter((_, i) => i !== index)
        setCommunityCards(newCommunityCards)
        calculateBestHand(holeCards, newCommunityCards)
    }

    const removeCard = (card: PokerCard) => {
        // 从holeCards中移除
        const newHoleCards = holeCards.filter(
            selectedCard => !(selectedCard.rank === card.rank && selectedCard.suit === card.suit)
        )
        // 从communityCards中移除
        const newCommunityCards = communityCards.filter(
            selectedCard => !(selectedCard.rank === card.rank && selectedCard.suit === card.suit)
        )

        setHoleCards(newHoleCards)
        setCommunityCards(newCommunityCards)
        calculateBestHand(newHoleCards, newCommunityCards)
    }

    const isCardSelected = (card: PokerCard) => {
        return [...holeCards, ...communityCards].some(
            selectedCard => selectedCard.rank === card.rank && selectedCard.suit === card.suit
        )
    }

    const calculateBestHand = (holeCards: PokerCard[], communityCards: PokerCard[]) => {
        // 重置所有状态
        setCurrentBestHand('')
        setCurrentBestHandCards([])
        setFutureBestHand('')
        setFutureBestHandCards([])
        setBestHand('')
        setBestHandCards([])
        setOpponentHandStats([])
        setOpponentHandTotal(0)
        setMyBestScore(-1)
        setNutsHand(null)

        // 检查手牌是否完整 - 手牌不全时不计算任何牌型
        if (holeCards.length < 2) {
            setBestHand('请先选择2张手牌')
            setCurrentBestHand('请先选择2张手牌')
            setFutureBestHand('')
            setAnalysisResult('')
            return
        }

        // 检查公牌数量是否足够
        if (communityCards.length < 3) {
            setBestHand('等待更多公牌...')
            setCurrentBestHand('等待更多公牌...')
            setFutureBestHand('')
            setAnalysisResult('')
            return
        }

        // 计算当前最大牌型（仅使用已出现的牌）
        const allCurrentCards = [...holeCards, ...communityCards]
        const currentCombinations = getAllCombinations(allCurrentCards, 5)

        let currentBestScore = -1
        let currentBestHandType = ''
        let currentBestCards: PokerCard[] = []

        currentCombinations.forEach(combination => {
            const handType = calculateHandStrength(combination)
            const score = getDetailedHandScore(handType, combination)
            if (score > currentBestScore) {
                currentBestScore = score
                currentBestHandType = handType
                currentBestCards = combination
            }
        })


        setCurrentBestHand(currentBestHandType)
        setCurrentBestHandCards(currentBestCards)

        // 一次遍历完成两件事：计算当前胜率 + 统计对手所有可能的牌型
        const opponentAnalysis = analyzeOpponents(holeCards, communityCards, currentBestScore)
        setCurrentWinRate(opponentAnalysis.winRate)
        setAnalysisResult(`当前最大牌型: ${currentBestHandType}
胜率: ${opponentAnalysis.winRate}%`)

        // 只有当公牌未完全出现时计算未来最大牌型
        if (communityCards.length < 5) {
            const remainingCards = POKER_CARDS.filter(card =>
                !isCardSelected(card) && !holeCards.some(holeCard =>
                    holeCard.rank === card.rank && holeCard.suit === card.suit
                )
            )

            // 计算未知牌数量（5 - 已出现的公牌数量）
            const unknownCardCount = 5 - communityCards.length

            let futureBestScore = -1
            let futureBestHandType = ''
            let futureBestCards: PokerCard[] = []

            // 如果当前手牌和公牌已经是最佳牌型，直接使用当前最佳
            const currentBest = getBestHand([...holeCards, ...communityCards])
            const currentScore = getDetailedHandScore(calculateHandStrength(currentBest.cards), currentBest.cards)

            // 检查是否需要寻找更好的未来牌型
            if (currentScore < 10000000) { // 如果不是皇家同花顺，继续寻找
                // 模拟所有可能的未来牌组合
                const futureCombinations = getAllCombinations(remainingCards, unknownCardCount)

                for (const futureCards of futureCombinations) {
                    const futureCommunityCards = [...communityCards, ...futureCards]
                    const allFutureCards = [...holeCards, ...futureCommunityCards]

                    if (allFutureCards.length >= 5) {
                        const combinations = getAllCombinations(allFutureCards, 5)

                        combinations.forEach(combination => {
                            const handType = calculateHandStrength(combination)
                            const score = getDetailedHandScore(handType, combination)

                            if (score > futureBestScore) {
                                futureBestScore = score
                                futureBestHandType = handType
                                futureBestCards = combination
                            }
                        })
                    }
                }
            } else {
                // 当前已经是皇家同花顺，未来最大牌型就是当前最佳
                futureBestHandType = currentBestHandType
                futureBestCards = currentBestCards
            }

            setFutureBestHand(futureBestHandType)
            setFutureBestHandCards(futureBestCards)
        } else {
            // 公牌已完全出现，未来最大牌型无意义
            setFutureBestHand('所有公牌已出现，未来最大牌型无意义')
            setFutureBestHandCards([])
        }

        // 展示对手所有可能的牌型（从强到弱），第一项即对手可能的最大牌型
        setOpponentHandStats(opponentAnalysis.handTypes)
        setOpponentHandTotal(opponentAnalysis.totalComboCount)
        setMyBestScore(currentBestScore)

        // 坚果牌（Nuts）：当前牌面上理论最强的一手牌
        // 「公牌 + 任意 2 张牌」的全部组合 = 我的手牌这一组 + 对手的所有组合，
        // 所以坚果牌就是「我的当前最佳」与「对手的最佳」中更强的那个
        const opponentTop = opponentAnalysis.handTypes[0]
        if (opponentTop && opponentTop.bestScore > currentBestScore) {
            setNutsHand({ handType: opponentTop.handType, cards: opponentTop.bestCards, isMine: false })
        } else {
            setNutsHand({ handType: currentBestHandType, cards: currentBestCards, isMine: true })
        }

        if (opponentAnalysis.handTypes.length > 0) {
            setBestHand(opponentAnalysis.handTypes[0].handType)
            setBestHandCards(opponentAnalysis.handTypes[0].bestCards)
        }
    }

    const clearAll = () => {
        setHoleCards([])
        setCommunityCards([])
        setAnalysisResult('')
        setBestHand('')
        setBestHandCards([])
        setCurrentBestHand('')
        setCurrentBestHandCards([])
        setFutureBestHand('')
        setFutureBestHandCards([])
        setOpponentHandStats([])
        setOpponentHandTotal(0)
        setMyBestScore(-1)
        setNutsHand(null)
        setCurrentWinRate('0.0')
    }

    const getAllCombinations = (cards: PokerCard[], k: number): PokerCard[][] => {
        if (k > cards.length || k <= 0) return []
        if (k === cards.length) return [cards]
        if (k === 1) return cards.map(card => [card])

        const combinations: PokerCard[][] = []

        for (let i = 0; i <= cards.length - k; i++) {
            const head = cards.slice(i, i + 1)
            const tailCombinations = getAllCombinations(cards.slice(i + 1), k - 1)
            tailCombinations.forEach(tail => {
                combinations.push(head.concat(tail))
            })
        }

        return combinations
    }

    const getHandScore = (handType: string, cards: PokerCard[]): number => {
        const scores: Record<string, number> = {
            '皇家同花顺': 10,
            '同花顺': 9,
            '四条': 8,
            '葫芦': 7,
            '同花': 6,
            '顺子': 5,
            '三条': 4,
            '两对': 3,
            '一对': 2,
            '高牌': 1
        }

        const baseScore = scores[handType] || 0
        const sortedValues = cards.map(card => card.value).sort((a, b) => b - a)

        // 对于同牌型，需要逐个比较所有牌值
        let detailedScore = 0
        for (let i = 0; i < sortedValues.length; i++) {
            detailedScore += sortedValues[i] * Math.pow(10, 4 - i)
        }

        return baseScore * 100000 + detailedScore
    }

    const getDetailedHandScore = (handType: string, cards: PokerCard[]): number => {
        // 牌型基础分数（确保牌型优先级）
        const baseScores: Record<string, number> = {
            '皇家同花顺': 10000000,
            '同花顺': 9000000,
            '四条': 8000000,
            '葫芦': 7000000,
            '同花': 6000000,
            '顺子': 5000000,
            '三条': 4000000,
            '两对': 3000000,
            '一对': 2000000,
            '高牌': 1000000
        }

        const baseScore = baseScores[handType] || 0
        const sortedValues = cards.map(card => card.value).sort((a, b) => b - a)
        const valueCounts = new Map<number, number>()
        sortedValues.forEach(value => {
            valueCounts.set(value, (valueCounts.get(value) || 0) + 1)
        })

        // 根据牌型进行精确比较
        if (handType === '皇家同花顺') {
            // 皇家同花顺没有比较，都是相等的
            return baseScore
        } else if (handType === '同花顺') {
            // 同花顺：比较最高牌值（正确处理上下顺）
            let highCard = sortedValues[0]
            // 处理A-5顺子（A,2,3,4,5）作为下顺
            if (sortedValues.includes(14) && sortedValues.includes(2) && sortedValues.includes(3) &&
                sortedValues.includes(4) && sortedValues.includes(5)) {
                highCard = 5 // A-5顺子的高牌是5（下顺）
            }
            return baseScore + highCard * 10000
        } else if (handType === '四条') {
            // 四条：比较四条的值，再比较踢脚
            const fourValue = Array.from(valueCounts.entries()).find(([_, count]) => count === 4)?.[0] || 0
            const kicker = sortedValues.find(value => value !== fourValue) || 0
            return baseScore + fourValue * 10000 + kicker
        } else if (handType === '葫芦') {
            // 葫芦：比较三条的值，再比较对子的值
            const threeValue = Array.from(valueCounts.entries()).find(([_, count]) => count === 3)?.[0] || 0
            const twoValue = Array.from(valueCounts.entries()).find(([_, count]) => count === 2)?.[0] || 0
            return baseScore + threeValue * 10000 + twoValue * 100
        } else if (handType === '同花') {
            // 同花：按牌值从大到小比较
            return baseScore + sortedValues[0] * 10000 + sortedValues[1] * 1000 +
                sortedValues[2] * 100 + sortedValues[3] * 10 + sortedValues[4]
        } else if (handType === '顺子') {
            // 顺子：比较最高牌值（注意A-5顺子）
            let highCard = sortedValues[0]
            // 处理A-5顺子（A,2,3,4,5）
            if (sortedValues.includes(14) && sortedValues.includes(2) && sortedValues.includes(3) &&
                sortedValues.includes(4) && sortedValues.includes(5)) {
                highCard = 5 // A-5顺子的高牌是5
            }
            return baseScore + highCard * 10000
        } else if (handType === '三条') {
            // 三条：比较三条的值，再比较剩余两张牌
            const threeValue = Array.from(valueCounts.entries()).find(([_, count]) => count === 3)?.[0] || 0
            const kickers = sortedValues.filter(value => value !== threeValue).sort((a, b) => b - a)
            return baseScore + threeValue * 10000 + (kickers[0] || 0) * 100 + (kickers[1] || 0)
        } else if (handType === '两对') {
            // 两对：比较大对子值，再比较小对子值，最后比较踢脚
            const pairs = Array.from(valueCounts.entries())
                .filter(([_, count]) => count === 2)
                .map(([value]) => value)
                .sort((a, b) => b - a)
            const kicker = sortedValues.find(value => !pairs.includes(value)) || 0
            return baseScore + (pairs[0] || 0) * 10000 + (pairs[1] || 0) * 100 + kicker
        } else if (handType === '一对') {
            // 一对：比较对子值，再比较剩余三张牌
            const pairValue = Array.from(valueCounts.entries()).find(([_, count]) => count === 2)?.[0] || 0
            const kickers = sortedValues.filter(value => value !== pairValue).sort((a, b) => b - a)
            return baseScore + pairValue * 10000 + (kickers[0] || 0) * 1000 +
                (kickers[1] || 0) * 100 + (kickers[2] || 0) * 10
        } else {
            // 高牌：按牌值从大到小比较
            return baseScore + sortedValues[0] * 10000 + sortedValues[1] * 1000 +
                sortedValues[2] * 100 + sortedValues[3] * 10 + sortedValues[4]
        }
    }

    const analyzeHand = () => {
        const totalCards = holeCards.length + communityCards.length

        if (totalCards < 2) {
            setAnalysisResult('请至少选择2张手牌')
            return
        }

        if (holeCards.length < 2) {
            setAnalysisResult('请选择2张手牌')
            return
        }

        // 计算当前手牌的最大牌型
        const currentHandCombinations = getAllCombinations([...holeCards, ...communityCards], 5)
        let currentBestScore = -1
        let currentBestHandType = ''

        currentHandCombinations.forEach(combination => {
            const handType = calculateHandStrength(combination)
            const score = getHandScore(handType, combination)
            if (score > currentBestScore) {
                currentBestScore = score
                currentBestHandType = handType
            }
        })

        // 使用蒙特卡洛模拟计算胜率
        const winProbability = calculateWinProbability(holeCards, communityCards)

        setAnalysisResult(`📊 胜率分析
当前手牌最大牌型: ${currentBestHandType}
胜率约为 ${winProbability}%`)
    }

    const calculateWinProbability = (holeCards: PokerCard[], communityCards: PokerCard[]): string => {
        const remainingCards = POKER_CARDS.filter(card => !isCardSelected(card))
        const remainingCount = remainingCards.length

        if (remainingCount === 0) return '100.0'

        let wins = 0
        let ties = 0
        let totalSimulations = 0

        // 根据公牌数量进行模拟
        if (communityCards.length === 0) {
            // 翻牌前：模拟1000次随机发牌
            totalSimulations = Math.min(1000, Math.floor(remainingCount * (remainingCount - 1) / 2))

            for (let i = 0; i < totalSimulations; i++) {
                const opponentCards = getRandomOpponentCards(remainingCards, 2)
                const result = compareHands(holeCards, opponentCards, communityCards)
                if (result === 'win') wins++
                if (result === 'tie') ties++
            }
        } else if (communityCards.length === 3) {
            // 翻牌后：模拟所有可能的对手手牌组合
            for (let i = 0; i < remainingCards.length; i++) {
                for (let j = i + 1; j < remainingCards.length; j++) {
                    const opponentCards = [remainingCards[i], remainingCards[j]]
                    const result = compareHands(holeCards, opponentCards, communityCards)
                    if (result === 'win') wins++
                    if (result === 'tie') ties++
                    totalSimulations++
                }
            }
        } else if (communityCards.length === 4) {
            // 转牌后：模拟剩余牌作为河牌
            for (let i = 0; i < remainingCards.length; i++) {
                const riverCard = remainingCards[i]
                const futureCommunityCards = [...communityCards, riverCard]
                const remainingAfterRiver = remainingCards.filter(card => card !== riverCard)

                // 模拟对手手牌
                for (let j = 0; j < remainingAfterRiver.length; j++) {
                    for (let k = j + 1; k < remainingAfterRiver.length; k++) {
                        const opponentCards = [remainingAfterRiver[j], remainingAfterRiver[k]]
                        const result = compareHands(holeCards, opponentCards, futureCommunityCards)
                        if (result === 'win') wins++
                        if (result === 'tie') ties++
                        totalSimulations++
                    }
                }
            }
        } else if (communityCards.length === 5) {
            // 河牌后：直接比较所有可能的对手手牌
            for (let i = 0; i < remainingCards.length; i++) {
                for (let j = i + 1; j < remainingCards.length; j++) {
                    const opponentCards = [remainingCards[i], remainingCards[j]]
                    const result = compareHands(holeCards, opponentCards, communityCards)
                    if (result === 'win') wins++
                    if (result === 'tie') ties++
                    totalSimulations++
                }
            }
        }

        const winRate = totalSimulations > 0 ? ((wins + ties * 0.5) / totalSimulations * 100) : 0
        return winRate.toFixed(1)
    }

    const getRandomOpponentCards = (remainingCards: PokerCard[], count: number): PokerCard[] => {
        const shuffled = [...remainingCards].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, count)
    }

    const compareHands = (myHoleCards: PokerCard[], opponentHoleCards: PokerCard[], communityCards: PokerCard[]): 'win' | 'lose' | 'tie' => {
        // 获取双方的最佳5张牌组合
        const myBestHand = getBestHand([...myHoleCards, ...communityCards])
        const opponentBestHand = getBestHand([...opponentHoleCards, ...communityCards])

        // 使用详细分数进行比较
        const myScore = getDetailedHandScore(calculateHandStrength(myBestHand.cards), myBestHand.cards)
        const opponentScore = getDetailedHandScore(calculateHandStrength(opponentBestHand.cards), opponentBestHand.cards)

        if (myScore > opponentScore) return 'win'
        if (myScore < opponentScore) return 'lose'
        return 'tie'
    }

    const getBestHand = (cards: PokerCard[]): { cards: PokerCard[], score: number } => {
        if (cards.length < 5) return { cards: [], score: -1 }

        const combinations = getAllCombinations(cards, 5)
        let bestScore = -1
        let bestHand: PokerCard[] = []

        combinations.forEach(combination => {
            const handType = calculateHandStrength(combination)
            const score = getDetailedHandScore(handType, combination)
            if (score > bestScore) {
                bestScore = score
                bestHand = combination
            }
        })

        return { cards: bestHand, score: bestScore }
    }

    /**
     * 分析对手所有可能的牌型
     *
     * 算法流程：
     * 1. 剩余牌堆 = 全部牌 - 我的手牌 - 已出现的公牌
     * 2. 对手手牌 = 从剩余牌堆中任选 2 张（C(n,2) 种组合）
     * 3. 每个对手手牌组合与公牌取最佳 5 张，得到该组合能组成的最强牌型
     * 4. 按牌型分组统计：每种牌型保留最强的牌例，并记录该牌型出现的组合数
     * 5. 同时统计我的当前牌型能赢下多少比例的对手组合（即胜率）
     */
    const analyzeOpponents = (holeCards: PokerCard[], communityCards: PokerCard[], currentBestScore: number) => {
        const handTypeOrder = ['皇家同花顺', '同花顺', '四条', '葫芦', '同花', '顺子', '三条', '两对', '一对', '高牌']
        const grouped = new Map<string, OpponentHandTypeStat>()
        let totalComboCount = 0   // 对手手牌组合总数
        let winCount = 0          // 我的当前牌型能赢的组合数

        if (communityCards.length < 3) {
            return { handTypes: [], totalComboCount: 0, winRate: '0.0' }
        }

        // 构建剩余牌堆：排除我的手牌和已出现的公牌
        const remainingCards = POKER_CARDS.filter(card =>
            !holeCards.some(holeCard => holeCard.rank === card.rank && holeCard.suit === card.suit) &&
            !communityCards.some(communityCard => communityCard.rank === card.rank && communityCard.suit === card.suit)
        )

        // 遍历所有可能的对手手牌组合
        for (let i = 0; i < remainingCards.length; i++) {
            for (let j = i + 1; j < remainingCards.length; j++) {
                const allCards = [...communityCards, remainingCards[i], remainingCards[j]]
                if (allCards.length < 5) continue

                // 对手这个手牌组合能组成的最强牌型
                const { cards: bestCards, score } = getBestHand(allCards)
                if (bestCards.length === 0) continue

                const handType = calculateHandStrength(bestCards)
                totalComboCount++
                if (score < currentBestScore) winCount++

                const stat = grouped.get(handType)
                if (stat) {
                    stat.count++
                    if (score > stat.bestScore) {
                        stat.bestCards = bestCards
                        stat.bestScore = score
                    }
                } else {
                    grouped.set(handType, { handType, bestCards, bestScore: score, count: 1 })
                }
            }
        }

        // 按牌型强弱从强到弱排序，只保留对手真的可能出现的牌型
        const handTypes = handTypeOrder
            .filter(handType => grouped.has(handType))
            .map(handType => grouped.get(handType)!)

        const winRate = totalComboCount > 0 ? (winCount / totalComboCount * 100).toFixed(1) : '0.0'

        return { handTypes, totalComboCount, winRate }
    }







    const calculateHandStrength = (cards: PokerCard[]): string => {
        if (cards.length < 5) return '等待更多公牌...'

        const ranks = cards.map(card => card.value)
        const suits = cards.map(card => card.suit)

        // 检查皇家同花顺
        if (isRoyalFlush(cards)) return '皇家同花顺'
        // 检查同花顺
        if (isStraightFlush(cards)) return '同花顺'
        // 检查四条
        if (isFourOfAKind(ranks)) return '四条'
        // 检查葫芦
        if (isFullHouse(ranks)) return '葫芦'
        // 检查同花
        if (isFlush(suits)) return '同花'
        // 检查顺子
        if (isStraight(ranks)) return '顺子'
        // 检查三条
        if (isThreeOfAKind(ranks)) return '三条'
        // 检查两对
        if (isTwoPair(ranks)) return '两对'
        // 检查一对
        if (isOnePair(ranks)) return '一对'

        return '高牌'
    }

    const isRoyalFlush = (cards: PokerCard[]): boolean => {
        if (!isFlush(cards.map(card => card.suit))) return false

        const royalRanks = [14, 13, 12, 11, 10] // A, K, Q, J, 10
        const cardRanks = cards.map(card => card.value)

        return royalRanks.every(rank => cardRanks.includes(rank))
    }



    // 完整的牌型判断辅助函数
    const isStraightFlush = (cards: PokerCard[]): boolean => {
        return isFlush(cards.map(card => card.suit)) && isStraight(cards.map(card => card.value))
    }

    const isFourOfAKind = (ranks: number[]): boolean => {
        const rankCounts = new Map<number, number>()
        ranks.forEach(rank => {
            rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
        })
        return Array.from(rankCounts.values()).some(count => count === 4)
    }

    const isFullHouse = (ranks: number[]): boolean => {
        const rankCounts = new Map<number, number>()
        ranks.forEach(rank => {
            rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
        })
        const counts = Array.from(rankCounts.values()).sort((a, b) => b - a)
        return counts.length >= 2 && counts[0] === 3 && counts[1] >= 2
    }

    const isFlush = (suits: string[]): boolean => {
        const suitCounts = new Map<string, number>()
        suits.forEach(suit => {
            suitCounts.set(suit, (suitCounts.get(suit) || 0) + 1)
        })
        return Array.from(suitCounts.values()).some(count => count >= 5)
    }

    const isStraight = (ranks: number[]): boolean => {
        const uniqueRanks = Array.from(new Set(ranks)).sort((a, b) => a - b)

        // 检查普通顺子
        for (let i = 0; i <= uniqueRanks.length - 5; i++) {
            if (uniqueRanks[i + 4] - uniqueRanks[i] === 4) {
                return true
            }
        }

        // 检查A-5顺子 (A,2,3,4,5)
        if (uniqueRanks.includes(14) && uniqueRanks.includes(2) && uniqueRanks.includes(3) &&
            uniqueRanks.includes(4) && uniqueRanks.includes(5)) {
            return true
        }

        return false
    }

    const isThreeOfAKind = (ranks: number[]): boolean => {
        const rankCounts = new Map<number, number>()
        ranks.forEach(rank => {
            rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
        })
        return Array.from(rankCounts.values()).some(count => count === 3)
    }

    const isTwoPair = (ranks: number[]): boolean => {
        const rankCounts = new Map<number, number>()
        ranks.forEach(rank => {
            rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
        })
        const pairCount = Array.from(rankCounts.values()).filter(count => count === 2).length
        return pairCount >= 2
    }

    const isOnePair = (ranks: number[]): boolean => {
        const rankCounts = new Map<number, number>()
        ranks.forEach(rank => {
            rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1)
        })
        return Array.from(rankCounts.values()).some(count => count === 2)
    }

    // 牌型分析展示用的牌张小卡片：圆点颜色区分 公牌 / 我的手牌 / 未出现牌
    const renderMiniCards = (cards: PokerCard[]) => (
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {cards.map((card, index) => {
                const isCommunityCard = communityCards.some(cc => cc.rank === card.rank && cc.suit === card.suit)
                const isHoleCard = holeCards.some(hc => hc.rank === card.rank && hc.suit === card.suit)
                return (
                    <div key={`${card.suit}-${card.rank}-${index}`} className="relative">
                        <PlayingCard
                            rank={card.rank}
                            suit={toCardSuit(card.suit)}
                            size="mini"
                            title={`${card.display} ${card.suitSymbol}`}
                        />
                        <span
                            className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-felt-900 ${
                                isCommunityCard ? 'bg-sky-400' : isHoleCard ? 'bg-emerald-400' : 'bg-orange-400'
                            }`}
                            title={isCommunityCard ? '公牌' : isHoleCard ? '我的手牌' : '未出现牌'}
                        />
                    </div>
                )
            })}
        </div>
    )

    const boardFull = holeCards.length === 2 && communityCards.length === 5
    const selectedCount = holeCards.length + communityCards.length
    const canShowWinRate =
        holeCards.length === 2 &&
        communityCards.length >= 3 &&
        Boolean(currentBestHand) &&
        currentBestHand !== '等待更多公牌...' &&
        currentBestHand !== '请先选择2张手牌'
    const analysisReady = canShowWinRate
    const showFuture =
        holeCards.length === 2 &&
        communityCards.length >= 3 &&
        communityCards.length < 5 &&
        Boolean(futureBestHand) &&
        futureBestHand !== '所有公牌已出现，未来最大牌型无意义'
    const countSelectedBySuit = (suit: string) =>
        [...holeCards, ...communityCards].filter(card => card.suit === suit).length

    const clearActiveSuit = () => {
        const newHoleCards = holeCards.filter(card => card.suit !== activeSuit)
        const newCommunityCards = communityCards.filter(card => card.suit !== activeSuit)
        setHoleCards(newHoleCards)
        setCommunityCards(newCommunityCards)
        calculateBestHand(newHoleCards, newCommunityCards)
    }

    return (
        <div className="page-transition pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-14">
                <PageHeading
                    eyebrow="HAND ANALYZER"
                    title="牌型分析工具"
                    subtitle="选择 2 张手牌与 3–5 张公牌，实时查看当前最佳牌型、未来可能牌型、对手范围与胜率。"
                    className="pb-8 md:pb-10"
                />

                {/* 牌面进度 */}
                <div className="mb-5 flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] tracking-[0.28em] text-gold-400/70">BOARD</span>
                        <div className="h-1.5 w-36 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-200 transition-all duration-300"
                                style={{ width: `${(selectedCount / 7) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs tabular-nums text-gold-200">{selectedCount}/7</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] tabular-nums ${holeCards.length === 2 ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-cream-muted'}`}>
                            手牌 {holeCards.length}/2
                        </span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] tabular-nums ${communityCards.length >= 3 ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : 'border-white/10 bg-white/[0.03] text-cream-muted'}`}>
                            公牌 {communityCards.length}/5
                        </span>
                        {canShowWinRate && (
                            <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[10px] tabular-nums text-gold-200">
                                胜率 {currentWinRate}%
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                    {/* 左侧：我的牌面 */}
                    <section className="ui-panel p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] tracking-[0.3em] text-gold-400/70">MY TABLE</p>
                                <h2 className="mt-2 font-display text-xl font-bold text-cream">我的牌面</h2>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] tabular-nums text-cream-muted">
                                {selectedCount}/7 已选
                            </span>
                        </div>

                        {/* 手牌 */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-[10px] font-semibold text-gold-200">1</span>
                                    <h3 className="text-sm font-semibold text-cream">手牌</h3>
                                    <span className="text-[11px] tabular-nums text-cream-dim">{holeCards.length}/2</span>
                                </div>
                                {holeCards.length === 2 && (
                                    <span className="text-[10px] tracking-wide text-emerald-300/80">已就位</span>
                                )}
                            </div>

                            <div className="mt-3 flex items-end gap-3">
                                {holeCards.map((card, index) => (
                                    <button
                                        key={`${card.suit}-${card.rank}-${index}`}
                                        type="button"
                                        onClick={() => removeHoleCard(index)}
                                        className="group relative rounded-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                                        title={`移除手牌 ${card.display}${card.suitSymbol}`}
                                        aria-label={`移除手牌 ${card.display}${card.suitSymbol}`}
                                    >
                                        <PlayingCard
                                            rank={card.rank}
                                            suit={toCardSuit(card.suit)}
                                            size="lg"
                                            title={`${card.display} ${card.suitSymbol}`}
                                        />
                                        <span className="absolute inset-0 rounded-lg bg-felt-950/0 transition-colors group-hover:bg-felt-950/25" aria-hidden="true" />
                                        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-felt-950/85 text-[11px] text-cream opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                                            ×
                                        </span>
                                    </button>
                                ))}
                                {Array.from({ length: 2 - holeCards.length }).map((_, index) => (
                                    <div
                                        key={`empty-hole-${index}`}
                                        className="flex h-[5.5rem] w-[3.7rem] items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-white/[0.03]"
                                    >
                                        <span className="font-display text-2xl text-white/20">?</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="my-5 h-px bg-gradient-to-r from-gold-500/25 via-white/[0.06] to-transparent" aria-hidden="true" />

                        {/* 公牌 */}
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-[10px] font-semibold text-gold-200">2</span>
                                    <h3 className="text-sm font-semibold text-cream">公牌</h3>
                                    <span className="text-[11px] tabular-nums text-cream-dim">{communityCards.length}/5</span>
                                </div>
                                {communityCards.length >= 3 && (
                                    <span className="text-[10px] tracking-wide text-emerald-300/80">可分析</span>
                                )}
                            </div>

                            <div className="mt-3 grid grid-cols-5 gap-2">
                                {communityCards.map((card, index) => (
                                    <button
                                        key={`${card.suit}-${card.rank}-${index}`}
                                        type="button"
                                        onClick={() => removeCommunityCard(index)}
                                        className="group relative mx-auto rounded-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                                        title={`移除公牌 ${card.display}${card.suitSymbol}`}
                                        aria-label={`移除公牌 ${card.display}${card.suitSymbol}`}
                                    >
                                        <PlayingCard
                                            rank={card.rank}
                                            suit={toCardSuit(card.suit)}
                                            size="responsive"
                                            title={`${card.display} ${card.suitSymbol}`}
                                        />
                                        <span className="absolute inset-0 rounded-lg bg-felt-950/0 transition-colors group-hover:bg-felt-950/25" aria-hidden="true" />
                                    </button>
                                ))}
                                {Array.from({ length: 5 - communityCards.length }).map((_, index) => (
                                    <div
                                        key={`empty-community-${index}`}
                                        className="mx-auto flex h-[3.4rem] w-[2.05rem] items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-white/[0.03] sm:h-[4rem] sm:w-[2.6rem] md:h-[4.85rem] md:w-[3.25rem]"
                                    >
                                        <span className="font-display text-lg text-white/20 sm:text-xl">?</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 grid grid-cols-5 gap-2 text-center text-[8px] tracking-[0.18em] text-cream-dim/70 sm:text-[9px]">
                                {['FLOP', 'FLOP', 'FLOP', 'TURN', 'RIVER'].map((label, index) => (
                                    <span key={label + index} className={index >= 3 ? 'text-gold-300/60' : ''}>{label}</span>
                                ))}
                            </div>
                        </div>

                        <p className="mt-5 text-[11px] leading-5 text-cream-dim">
                            {holeCards.length < 2
                                ? '先从右侧牌库选择 2 张手牌。'
                                : communityCards.length < 3
                                    ? '再选择至少 3 张公牌（翻牌），即可开始分析。'
                                    : '点击任意已选牌可将其放回牌库。'}
                        </p>
                    </section>

                    {/* 牌张选择 - Tabs标签页形式 */}
                    <div ref={cardSelectionRef} className="ui-panel p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] tracking-[0.3em] text-gold-400/70">CARD DECK</p>
                                <h2 className="mt-2 font-display text-xl font-bold text-cream">选牌</h2>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-[10px] tracking-wide ${
                                boardFull
                                    ? 'border-gold-400/30 bg-gold-400/10 text-gold-200'
                                    : 'border-white/10 bg-white/[0.03] text-cream-muted'
                            }`}>
                                {boardFull ? '牌面已满' : holeCards.length < 2 ? '选择手牌' : `选择公牌 ${communityCards.length}/5`}
                            </span>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-cream-muted">
                            {boardFull
                                ? '牌面已满。点击已选牌可移除，再重新选择。'
                                : holeCards.length < 2
                                    ? '先选择 2 张手牌；随后选择的牌会自动加入公牌。'
                                    : '继续选择公牌，选满 3 张后自动开始分析。'}
                        </p>

                        {/* 花色选择 Tabs */}
                        <div className="mt-4">
                            <div
                                ref={suitTabsRef}
                                className="grid grid-cols-4 gap-2"
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            >
                                {SUITS.map((suitInfo, index) => {
                                    const selectedInSuit = countSelectedBySuit(suitInfo.suit)
                                    return (
                                        <button
                                            key={suitInfo.suit}
                                            data-suit={suitInfo.suit}
                                            onClick={(event) => selectSuit(index, event.currentTarget)}
                                            className={`relative flex flex-col items-center rounded-xl border px-2 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 ${
                                                activeSuit === suitInfo.suit
                                                    ? 'border-gold-400/50 bg-gold-400/10 shadow-[0_10px_24px_-16px_rgba(217,180,90,0.8)]'
                                                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <span className={`text-2xl leading-none ${suitInfo.color}`}>{suitInfo.symbol}</span>
                                            <span className={`mt-1 text-[11px] ${activeSuit === suitInfo.suit ? 'text-gold-100' : 'text-cream-muted'}`}>{suitInfo.name}</span>
                                            {selectedInSuit > 0 && (
                                                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-300 text-[9px] font-bold leading-none text-felt-950">
                                                    {selectedInSuit}
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 牌张选择区域 - 手机上左右滑动可直接切换花色 */}
                        <div
                            ref={cardPagerRef}
                            onScroll={handlePagerScroll}
                            className="mt-3 flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {SUITS.map(suitInfo => (
                                <div key={suitInfo.suit} className="w-full shrink-0 snap-start">
                                    <div className="grid grid-cols-5 gap-1 min-[360px]:grid-cols-7 sm:gap-2">
                                        {POKER_CARDS
                                            .filter(card => card.suit === suitInfo.suit)
                                            .map(card => {
                                                const selected = isCardSelected(card)
                                                const disabled = boardFull && !selected
                                                return (
                                                    <button
                                                        key={`${card.suit}-${card.rank}`}
                                                        onClick={() => {
                                                            if (selected) {
                                                                removeCard(card)
                                                            } else if (holeCards.length < 2) {
                                                                addHoleCard(card)
                                                            } else if (communityCards.length < 5) {
                                                                addCommunityCard(card)
                                                            }
                                                        }}
                                                        disabled={disabled}
                                                        aria-pressed={selected}
                                                        aria-label={selected ? `移除 ${card.display}${card.suitSymbol}` : disabled ? '牌面已满，请先移除已选牌' : `选择 ${card.display}${card.suitSymbol}`}
                                                        title={selected ? `移除 ${card.display}${card.suitSymbol}` : disabled ? '牌面已满，请先移除已选牌' : `选择 ${card.display}${card.suitSymbol}`}
                                                        className={`group relative flex items-center justify-center rounded-lg p-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 disabled:cursor-not-allowed disabled:opacity-30 sm:p-1 ${
                                                            selected
                                                                ? 'bg-gold-400/10 ring-1 ring-gold-400/50'
                                                                : 'hover:-translate-y-0.5 hover:bg-white/[0.04]'
                                                        }`}
                                                    >
                                                        <PlayingCard
                                                            rank={card.rank}
                                                            suit={toCardSuit(card.suit)}
                                                            size="responsive"
                                                            className={selected ? 'opacity-35' : ''}
                                                            title={`${card.display} ${card.suitSymbol}`}
                                                        />
                                                        {selected && (
                                                            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-300 text-[9px] font-bold text-felt-950 shadow" aria-hidden="true">✓</span>
                                                        )}
                                                    </button>
                                                )
                                            })}
                                    </div>
                                    <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-cream-dim">
                                        <span>{suitInfo.name} · 13 张</span>
                                        <span>{countSelectedBySuit(suitInfo.suit)} 张已选</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 快速操作 */}
                        <div className="mt-4 flex gap-2">
                            <button onClick={clearActiveSuit} className="btn-ghost flex-1 px-3 py-2 text-xs">
                                清空当前花色
                            </button>
                            <button onClick={clearAll} className="btn-danger flex-1 px-3 py-2 text-xs">
                                清空所有牌张
                            </button>
                        </div>
                    </div>
                </div>

                {/* 牌型分析 */}
                <section className="ui-panel mt-5 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 border-b border-gold-500/10 pb-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[10px] tracking-[0.3em] text-gold-400/70">LIVE ANALYSIS</p>
                            <h2 className="mt-2 font-display text-2xl font-bold text-cream">牌型分析</h2>
                            <p className="mt-1 text-sm text-cream-muted">基于已选手牌与公牌实时计算，公共牌未发完时会预测未来牌型。</p>
                        </div>
                        {canShowWinRate && (
                            <div className="w-full max-w-xs md:w-64">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[11px] tracking-wide text-cream-muted">当前胜率</span>
                                    <span className="gold-text font-display text-2xl font-bold tabular-nums">{currentWinRate}%</span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-100 transition-all duration-500"
                                        style={{ width: `${Math.min(100, Math.max(0, parseFloat(currentWinRate) || 0))}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {!analysisReady ? (
                        <div className="mt-5 rounded-xl border border-dashed border-gold-500/25 bg-white/[0.015] px-5 py-10 text-center">
                            <div className="flex justify-center gap-2" aria-hidden="true">
                                {[0, 1, 2].map(index => (
                                    <div
                                        key={index}
                                        className={`flex h-16 w-11 items-center justify-center rounded-md border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent ${index === 1 ? '-translate-y-1.5' : ''}`}
                                    >
                                        <span className="font-display text-xl text-white/20">?</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 font-display text-lg text-cream">
                                {holeCards.length < 2 ? '先选择 2 张手牌' : '再选择至少 3 张公牌'}
                            </p>
                            <p className="mt-1.5 text-sm text-cream-muted">
                                {holeCards.length < 2
                                    ? '从右侧牌库点选你的底牌，选完后再补公共牌。'
                                    : '翻牌 3 张即可开始分析；继续补转牌与河牌，结果会实时更新。'}
                            </p>
                            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-cream-dim">
                                <span>① 选手牌</span>
                                <span>② 选公牌</span>
                                <span>③ 自动分析</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* 当前 / 未来 */}
                            <div className={`mt-5 grid gap-3 ${showFuture ? 'md:grid-cols-2' : ''}`}>
                                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 md:p-5">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-[10px] tracking-[0.24em] text-emerald-300/70">CURRENT BEST</p>
                                            <h3 className="mt-1.5 font-display text-xl font-bold text-emerald-100">{currentBestHand}</h3>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-200">
                                            当前最大
                                        </span>
                                    </div>
                                    <div className="mt-3">{renderMiniCards(currentBestHandCards)}</div>
                                </div>

                                {showFuture && (
                                    <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.05] p-4 md:p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-[10px] tracking-[0.24em] text-violet-300/70">NEXT BEST</p>
                                                <h3 className="mt-1.5 font-display text-xl font-bold text-violet-100">{futureBestHand}</h3>
                                            </div>
                                            <span className="shrink-0 rounded-full border border-violet-300/25 bg-violet-400/10 px-2 py-0.5 text-[10px] text-violet-200">
                                                未来可能
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[11px] text-violet-300/60">
                                            考虑未出现的转牌{communityCards.length === 4 ? '' : '和河牌'}（还剩 {5 - communityCards.length} 张公共牌）
                                        </p>
                                        <div className="mt-3">{renderMiniCards(futureBestHandCards)}</div>
                                    </div>
                                )}
                            </div>

                            {/* 标记图例 */}
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-cream-dim">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />公牌
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />我的手牌
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-orange-400" aria-hidden="true" />未出现牌
                                </span>
                            </div>

                            {/* 坚果牌 */}
                            {nutsHand && (
                                <div className={`mt-3 rounded-xl border p-4 md:p-5 ${nutsHand.isMine ? 'border-emerald-400/25 bg-emerald-400/[0.05]' : 'border-gold-400/25 bg-gold-400/[0.05]'}`}>
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-cream">🥜 坚果牌 · Nuts</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] ${nutsHand.isMine ? 'bg-emerald-400/15 text-emerald-200' : 'bg-gold-400/15 text-gold-200'}`}>
                                                {nutsHand.isMine ? '你已拿到' : '不在你手上'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-cream-dim">当前牌面理论最强</span>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-cream-muted">
                                        最强牌型：<span className="font-medium text-cream">{nutsHand.handType}</span>
                                        {nutsHand.isMine
                                            ? '（就是你现在的牌，没人能大过你）'
                                            : '（你的牌比它小，对手可能拿到）'}
                                    </p>
                                    <div className="mt-3">{renderMiniCards(nutsHand.cards)}</div>
                                </div>
                            )}

                            {/* 对手范围 */}
                            {opponentHandStats.length > 0 && (
                                <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-5">
                                    <div className="flex flex-wrap items-end justify-between gap-2">
                                        <div>
                                            <p className="text-[10px] tracking-[0.24em] text-sky-300/60">OPPONENT RANGE</p>
                                            <h3 className="mt-1.5 font-display text-lg font-bold text-cream">
                                                对手可能的牌型
                                                <span className="ml-1 text-sm font-normal text-cream-muted">（{opponentHandStats.length} 种）</span>
                                            </h3>
                                        </div>
                                        <span className="text-[11px] tabular-nums text-cream-dim">共 {opponentHandTotal} 种手牌组合</span>
                                    </div>
                                    <p className="mt-1 text-[11px] leading-5 text-cream-dim">
                                        最大牌型：{bestHand}；占比 = 该牌型在对手手牌组合中的比例。
                                        <span className="text-red-300/80">红色 = 对手可能大过你。</span>
                                    </p>

                                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                                        {opponentHandStats.map((stat, index) => {
                                            const percent = opponentHandTotal > 0 ? (stat.count / opponentHandTotal * 100) : 0
                                            const isMax = index === 0
                                            const beatsMe = myBestScore >= 0 && stat.bestScore > myBestScore
                                            const tiesMe = myBestScore >= 0 && stat.bestScore === myBestScore
                                            return (
                                                <div
                                                    key={stat.handType}
                                                    className={`rounded-lg border p-3 ${beatsMe
                                                        ? 'border-red-400/25 bg-red-500/[0.06]'
                                                        : isMax
                                                            ? 'border-gold-400/30 bg-gold-400/[0.07]'
                                                            : 'border-white/[0.06] bg-white/[0.025]'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                                                            <span className={`truncate text-sm font-semibold ${beatsMe ? 'text-red-200' : isMax ? 'text-gold-100' : 'text-cream'}`}>
                                                                {stat.handType}
                                                            </span>
                                                            {isMax && (
                                                                <span className="shrink-0 rounded-full bg-gold-400/20 px-1.5 py-0.5 text-[9px] text-gold-200">最大</span>
                                                            )}
                                                            {beatsMe && (
                                                                <span className="shrink-0 rounded-full bg-red-400/20 px-1.5 py-0.5 text-[9px] text-red-200">大于我</span>
                                                            )}
                                                            {!beatsMe && tiesMe && (
                                                                <span className="shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-cream-muted">可打平</span>
                                                            )}
                                                        </div>
                                                        <span className={`shrink-0 text-[11px] tabular-nums ${beatsMe ? 'text-red-300' : isMax ? 'text-gold-200' : 'text-cream-muted'}`}>
                                                            {percent.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                                                        <div
                                                            className={`h-full rounded-full ${beatsMe ? 'bg-red-400/70' : isMax ? 'bg-gold-300/80' : 'bg-sky-400/60'}`}
                                                            style={{ width: `${Math.min(100, percent)}%` }}
                                                        />
                                                    </div>
                                                    <div className="mt-2.5">{renderMiniCards(stat.bestCards)}</div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>

            {/* 悬浮窗 - 显示已选手牌和公牌，可从右侧滑入/滑出 */}
            {(holeCards.length > 0 || communityCards.length > 0) && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div
                        ref={floatingDrawerRef}
                        onPointerDown={handleDrawerPointerDown}
                        onPointerMove={handleDrawerPointerMove}
                        onPointerUp={() => finishDrawerDrag(false)}
                        onPointerCancel={() => finishDrawerDrag(true)}
                        className={`relative touch-pan-y transition-transform duration-300 ease-out ${showFloatingPanel ? 'translate-x-0' : 'translate-x-[calc(100%+16px)]'}`}
                        style={panelDragX !== null ? { transform: `translateX(${panelDragX}px)`, transition: 'none' } : undefined}
                    >
                        {/* 侧边把手：单击或左右滑动都能展开/收起 */}
                        <button
                            onClick={toggleFloatingPanel}
                            className="absolute -left-10 top-1/2 flex h-20 w-10 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-l-xl bg-gradient-to-r from-gold-300 to-gold-500 text-felt-950 shadow-lg"
                            title={showFloatingPanel ? '收起已选牌张' : '展开已选牌张'}
                            aria-label={showFloatingPanel ? '收起已选牌张' : '展开已选牌张'}
                            aria-expanded={showFloatingPanel}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`transition-transform duration-300 ${showFloatingPanel ? '' : 'rotate-180'}`}
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                            <span className="text-[8px] font-bold leading-none tabular-nums">已选{selectedCount}</span>
                        </button>

                        <div
                            aria-hidden={!showFloatingPanel}
                            className="w-[300px] max-w-[85vw] rounded-2xl border border-gold-500/30 bg-felt-900/95 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-[9px] tracking-[0.24em] text-gold-400/70">SELECTED</p>
                                    <h3 className="mt-0.5 text-sm font-semibold text-cream">
                                        已选牌张
                                        <span className="ml-1 text-[11px] font-normal text-cream-dim">({selectedCount}/7)</span>
                                    </h3>
                                </div>
                                <button
                                    onClick={clearAll}
                                    className="rounded-md border border-red-400/25 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 transition-colors hover:bg-red-500/20"
                                >
                                    清空
                                </button>
                            </div>

                            {/* 手牌显示 */}
                            {holeCards.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-[11px] text-cream-dim">
                                        <span>手牌 ({holeCards.length}/2)</span>
                                        {canShowWinRate && <span className="text-gold-200">胜率 {currentWinRate}%</span>}
                                    </div>
                                    <div className="mt-1.5 flex gap-1.5">
                                        {holeCards.map((card, index) => (
                                            <button
                                                key={`${card.suit}-${card.rank}-${index}`}
                                                type="button"
                                                onClick={() => removeHoleCard(index)}
                                                className="rounded-md transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
                                                title={`移除手牌 ${card.display}${card.suitSymbol}`}
                                                aria-label={`移除手牌 ${card.display}${card.suitSymbol}`}
                                            >
                                                <PlayingCard
                                                    rank={card.rank}
                                                    suit={toCardSuit(card.suit)}
                                                    size="sm"
                                                    title={`${card.display} ${card.suitSymbol}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 公牌显示 */}
                            {communityCards.length > 0 && (
                                <div className="mt-3">
                                    <div className="text-[11px] text-cream-dim">公牌 ({communityCards.length}/5)</div>
                                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {communityCards.map((card, index) => (
                                            <button
                                                key={`${card.suit}-${card.rank}-${index}`}
                                                type="button"
                                                onClick={() => removeCommunityCard(index)}
                                                className="rounded-md transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60"
                                                title={`移除公牌 ${card.display}${card.suitSymbol}`}
                                                aria-label={`移除公牌 ${card.display}${card.suitSymbol}`}
                                            >
                                                <PlayingCard
                                                    rank={card.rank}
                                                    suit={toCardSuit(card.suit)}
                                                    size="sm"
                                                    title={`${card.display} ${card.suitSymbol}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>)
}
export default PokerAnalyzerPage