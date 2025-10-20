import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface PokerCard {
    rank: string
    suit: string
    suitSymbol: string
    isRed: boolean
    value: number
    display: string
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

const PokerAnalyzerPage: React.FC = () => {
    const navigate = useNavigate()
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
    const [showFloatingPanel, setShowFloatingPanel] = useState<boolean>(true)
    const cardSelectionRef = useRef<HTMLDivElement>(null)





    const addHoleCard = (card: PokerCard) => {
        if (holeCards.length < 2 && !isCardSelected(card)) {
            const newHoleCards = [...holeCards, card]
            setHoleCards(newHoleCards)
            calculateBestHand(newHoleCards, communityCards)
            // 添加牌时展开悬浮窗
            setShowFloatingPanel(true)
        }
    }

    const addCommunityCard = (card: PokerCard) => {
        if (communityCards.length < 5 && !isCardSelected(card)) {
            const newCommunityCards = [...communityCards, card]
            setCommunityCards(newCommunityCards)
            calculateBestHand(holeCards, newCommunityCards)
            // 添加牌时展开悬浮窗
            setShowFloatingPanel(true)
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

        // 计算胜率：当前牌型在所有可能组合中的相对排名
        const winRate = calculateCurrentWinRate(holeCards, communityCards, currentBestScore)
        setCurrentWinRate(winRate)
        setAnalysisResult(`当前最大牌型: ${currentBestHandType}
胜率: ${winRate}%`)

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

        /**
         * 计算对手可能的最大牌型（考虑对手手牌中的未出现牌）
         * 
         * 功能说明：
         * 1. 从剩余牌堆中排除已出现的手牌和公牌
         * 2. 遍历所有可能的对手手牌组合（C(n,2)）
         * 3. 对每个对手手牌组合，计算其与公牌组成的最佳5张牌组合
         * 4. 使用改进的同牌型比较逻辑（getDetailedHandScore）进行精确比较
         * 5. 找出所有可能对手组合中的最强牌型
         * 
         * 算法流程：
         * - 剩余牌堆 = 总牌堆 - 手牌 - 公牌
         * - 对手手牌组合 = 从剩余牌堆中任选2张
         * - 对手牌型 = 对手手牌 + 公牌 组成的最佳5张牌组合
         * - 比较所有对手牌型，找出最强的一个
         */
        let bestHandType = ''
        let bestHandCards: PokerCard[] = []
        let bestScore = -1

        // 构建剩余牌堆：排除已出现的手牌和公牌
        const remainingCards = POKER_CARDS.filter(card =>
            !isCardSelected(card) &&
            !holeCards.some(holeCard =>
                holeCard.rank === card.rank && holeCard.suit === card.suit
            ) &&
            !communityCards.some(communityCard =>
                communityCard.rank === card.rank && communityCard.suit === card.suit
            )
        )

        // 遍历所有可能的对手手牌组合
        for (let i = 0; i < remainingCards.length; i++) {
            for (let j = i + 1; j < remainingCards.length; j++) {
                const opponentHoleCards = [remainingCards[i], remainingCards[j]]
                const allCards = [...communityCards, ...opponentHoleCards]

                // 确保有足够的牌组成5张牌组合
                if (allCards.length >= 5) {
                    const combinations = getAllCombinations(allCards, 5)

                    // 计算对手可能的最佳牌型
                    combinations.forEach(combination => {
                        const handType = calculateHandStrength(combination)
                        const score = getDetailedHandScore(handType, combination)

                        // 更新最佳牌型记录
                        if (score > bestScore) {
                            bestScore = score
                            bestHandType = handType
                            bestHandCards = combination
                        }
                    })
                }
            }
        }

        setBestHand(bestHandType)
        setBestHandCards(bestHandCards)
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

    // 计算当前牌型在所有可能组合中的胜率（简化版）
    const calculateCurrentWinRate = (holeCards: PokerCard[], communityCards: PokerCard[], currentBestScore: number): string => {
        // 排除已出现的手牌和公牌，得到剩余牌堆
        const remainingCards = POKER_CARDS.filter(card =>
            !isCardSelected(card) &&
            !holeCards.some(holeCard =>
                holeCard.rank === card.rank && holeCard.suit === card.suit
            ) &&
            !communityCards.some(communityCard =>
                communityCard.rank === card.rank && communityCard.suit === card.suit
            )
        )

        let winCount = 0      // 当前牌型能赢的组合数
        let totalPossibleHands = 0

        // 计算所有可能的对手手牌组合
        for (let i = 0; i < remainingCards.length; i++) {
            for (let j = i + 1; j < remainingCards.length; j++) {
                const opponentCards = [remainingCards[i], remainingCards[j]]
                const allCards = [...communityCards, ...opponentCards]

                if (allCards.length >= 5) {
                    // 计算对手可能的最大牌型分数
                    const combinations = getAllCombinations(allCards, 5)
                    let opponentBestScore = -1

                    combinations.forEach(combination => {
                        const handType = calculateHandStrength(combination)
                        const score = getDetailedHandScore(handType, combination)
                        if (score > opponentBestScore) {
                            opponentBestScore = score
                        }
                    })

                    // 比较当前牌型与对手牌型
                    if (opponentBestScore < currentBestScore) {
                        winCount++        // 当前牌型更强
                    }
                    totalPossibleHands++
                }
            }
        }

        if (totalPossibleHands === 0) return '100.0'

        // 胜率公式：赢牌数 / 剩余牌总数
        const winRate = (winCount / totalPossibleHands * 100).toFixed(1)
        return winRate
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



    return (
        <div className="min-h-screen p-4 page-transition">
            {/* 返回按钮 */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                >
                    ← 回到首页
                </button>
                <button
                    onClick={() => navigate('/poker')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
                >
                    ← 返回扑克主页
                </button>
            </div>

            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">牌型分析工具</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 左侧：手牌和公牌选择 */}
                    <div className="space-y-6">
                        {/* 手牌区域 */}
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-semibold text-blue-600">手牌 (2张)</h2>
                                {/* 胜率显示 - 只在手牌完整且公牌足够时显示 */}
                                {holeCards.length === 2 && communityCards.length >= 3 && currentBestHand && currentBestHand !== '等待更多公牌...' && (
                                    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                                        胜率: {currentWinRate}%
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3 mb-4">
                                {holeCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="relative"
                                        onClick={() => removeHoleCard(index)}
                                    >
                                        <div className={`
                      w-16 h-20 bg-white rounded-lg shadow-md border-2 cursor-pointer
                      ${card.isRed ? 'border-red-300 hover:border-red-500' : 'border-gray-300 hover:border-gray-500'}
                      flex flex-col items-center justify-center p-2 transition-all duration-200 hover:scale-105 active:scale-95
                    `}>
                                            <div className={`text-base font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                {card.display}
                                            </div>
                                            <div className={`text-xl ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                {card.suitSymbol}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 2 - holeCards.length }).map((_, index) => (
                                    <div key={index} className="w-16 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                        <span className="text-gray-400 text-xl">?</span>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* 公牌区域 */}
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-semibold mb-3 text-green-600">公牌 ({communityCards.length}/5)</h2>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {communityCards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="relative"
                                        onClick={() => removeCommunityCard(index)}
                                    >
                                        <div className={`
                      w-12 h-16 bg-white rounded-lg shadow-md border-2 cursor-pointer
                      ${card.isRed ? 'border-red-300 hover:border-red-500' : 'border-gray-300 hover:border-gray-500'}
                      flex flex-col items-center justify-center p-1 transition-all duration-200 hover:scale-105 active:scale-95
                    `}>
                                            <div className={`text-sm font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                {card.display}
                                            </div>
                                            <div className={`text-lg ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                {card.suitSymbol}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Array.from({ length: 5 - communityCards.length }).map((_, index) => (
                                    <div key={index} className="w-12 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                        <span className="text-gray-400 text-lg">?</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 牌型分析展示 */}
                        <div className="bg-white p-4 rounded-2xl shadow-lg">
                            <h2 className="text-xl font-semibold mb-3 text-amber-600">牌型分析展示</h2>
                            <div className="space-y-3 mt-3">
                                {/* 手牌不全时的提示 */}
                                {holeCards.length < 2 && (
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <div className="text-sm text-yellow-700 font-medium">请先选择2张手牌</div>
                                    </div>
                                )}

                                {/* 公牌不足时的提示 */}
                                {holeCards.length === 2 && communityCards.length < 3 && (
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <div className="text-sm text-yellow-700 font-medium">等待更多公牌...</div>
                                    </div>
                                )}

                                {/* 当前最大牌型 - 只在手牌完整且公牌足够时显示 */}
                                {holeCards.length === 2 && communityCards.length >= 3 && currentBestHand && currentBestHand !== '等待更多公牌...' && (
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <div className="text-sm text-green-700 font-medium mb-2">我的目前最大牌型: {currentBestHand}</div>
                                        <div className="flex space-x-2">
                                            {currentBestHandCards.map((card, index) => (
                                                <div key={index} className={`
                          w-10 h-12 bg-white rounded shadow-sm border-2
                          ${card.isRed ? 'border-red-300' : 'border-gray-300'}
                          flex flex-col items-center justify-center p-1 text-xs relative
                        `}>
                                                    <div className={`font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.display}
                                                    </div>
                                                    <div className={`${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.suitSymbol}
                                                    </div>
                                                    {communityCards.some(cc => cc.rank === card.rank && cc.suit === card.suit) && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 未来最大牌型 - 只在手牌完整、公牌未完全出现且有意义时显示 */}
                                {holeCards.length === 2 && communityCards.length >= 3 && communityCards.length < 5 && futureBestHand && futureBestHand !== '所有公牌已出现，未来最大牌型无意义' && (
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="text-sm text-purple-700 font-medium mb-2">我未来的最大牌型: {futureBestHand}</div>
                                        <div className="text-xs text-purple-500 mb-2">（考虑未出现的转牌{communityCards.length == 4 ? '' : '和河牌'}）</div>
                                        <div className="flex space-x-2">
                                            {futureBestHandCards.map((card, index) => (
                                                <div key={index} className={`
                                            w-10 h-12 bg-white rounded shadow-sm border-2
                                            ${card.isRed ? 'border-red-300' : 'border-gray-300'}
                                            flex flex-col items-center justify-center p-1 text-xs relative
                                            `}>
                                                    <div className={`font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.display}
                                                    </div>
                                                    <div className={`${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.suitSymbol}
                                                    </div>
                                                    {![...holeCards, ...communityCards].some(selectedCard =>
                                                        selectedCard.rank === card.rank && selectedCard.suit === card.suit
                                                    ) && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                                                        )}
                                                    {communityCards.some(cc => cc.rank === card.rank && cc.suit === card.suit) && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 对手最大牌型组合 - 只在手牌完整且公牌足够时显示 */}
                                {holeCards.length === 2 && communityCards.length >= 3 && bestHandCards.length > 0 && (
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <div className="text-sm text-blue-700 font-medium mb-2">对手可能的最大牌型: {bestHand}</div>
                                        <div className="flex space-x-2">
                                            {bestHandCards.map((card, index) => (
                                                <div key={index} className={`
                          w-10 h-12 bg-white rounded shadow-sm border-2
                          ${card.isRed ? 'border-red-300' : 'border-gray-300'}
                          flex flex-col items-center justify-center p-1 text-xs relative
                        `}>
                                                    <div className={`font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.display}
                                                    </div>
                                                    <div className={`${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                        {card.suitSymbol}
                                                    </div>
                                                    {communityCards.some(cc => cc.rank === card.rank && cc.suit === card.suit) && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white" title="公牌"></div>
                                                    )}
                                                    {![...holeCards, ...communityCards].some(selectedCard =>
                                                        selectedCard.rank === card.rank && selectedCard.suit === card.suit
                                                    ) && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white" title="未出现牌"></div>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}{
                                    <div className="text-xs text-gray-600 mt-2 flex items-center space-x-3">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                            <span>公牌</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                                            <span>未出现牌</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* 控制按钮 */}
                        <div className="flex space-x-4">
                            <button
                                onClick={analyzeHand}
                                disabled={true}
                                className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg shadow-md cursor-not-allowed"
                            >
                                分析牌型（待开发）
                            </button>
                            <button
                                onClick={clearAll}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                            >
                                清空
                            </button>
                        </div>

                        {/* 分析结果 */}
                        {analysisResult && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-yellow-700 font-medium">{analysisResult}</p>
                            </div>
                        )}
                    </div>

                    {/* 牌张选择 */}
                    <div ref={cardSelectionRef} className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-purple-600">选择牌张</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {POKER_CARDS.map(card => (
                                <button
                                    key={`${card.suit}-${card.rank}`}
                                    onClick={() => {
                                        if (holeCards.length < 2) {
                                            addHoleCard(card)
                                        } else if (communityCards.length < 5) {
                                            addCommunityCard(card)
                                        }
                                    }}
                                    disabled={isCardSelected(card)}
                                    className={`
                    w-12 h-16 bg-white rounded shadow-sm border-2 transition-all duration-200
                    ${card.isRed ? 'border-red-300 hover:border-red-500' : 'border-gray-300 hover:border-gray-500'}
                    ${isCardSelected(card) ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                    flex flex-col items-center justify-center p-1
                  `}
                                >
                                    <div className={`text-sm font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                        {card.display}
                                    </div>
                                    <div className={`text-base ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                        {card.suitSymbol}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 悬浮窗 - 显示已选手牌和公牌 */}
            <div className="fixed bottom-4 right-4 z-50">
                {/* 收起状态的小按钮 */}
                {!showFloatingPanel && (holeCards.length > 0 || communityCards.length > 0) && (
                    <button
                        onClick={() => setShowFloatingPanel(true)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                        title="展开悬浮窗"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                )}

                {/* 展开状态的悬浮窗 */}
                {showFloatingPanel && (holeCards.length > 0 || communityCards.length > 0) && (
                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-blue-300 max-w-xs">
                        <div className="flex justify-between items-center mb-3 gap-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowFloatingPanel(false)}
                                    className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 transition-all transform hover:scale-110 p-2 rounded-full border border-blue-200"
                                    title="收起悬浮窗"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </button>
                                <h3 className="text-sm font-semibold text-blue-600">已选牌张</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setHoleCards([]);
                                    setCommunityCards([]);
                                }}
                                className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                            >
                                清空
                            </button>
                        </div>

                        {/* 手牌显示 */}
                        {holeCards.length > 0 && (
                            <div className="mb-3">
                                <div className='flex space-x-4'>
                                    <div className="text-xs text-gray-600 ">手牌 ({holeCards.length}/2)</div>
                                    {/* 胜率显示（如果可用） */}
                                    {holeCards.length === 2 && communityCards.length >= 3 && currentWinRate !== '0.0' && (
                                        <div className="text-xs text-green-600 font-medium">胜率: {currentWinRate}%</div>
                                    )}
                                </div>

                                <div className="flex space-x-1 mt-2">
                                    {holeCards.map((card, index) => (
                                        <div key={index} className="relative group">
                                            <div className={`
                                                w-8 h-10 bg-white rounded shadow-sm border
                                                ${card.isRed ? 'border-red-300' : 'border-gray-300'}
                                                flex flex-col items-center justify-center p-1 text-xs
                                            `}>
                                                <div className={`font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                    {card.display}
                                                </div>
                                                <div className={`${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                    {card.suitSymbol}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeHoleCard(index)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="移除这张牌"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 公牌显示 */}
                        {communityCards.length > 0 && (
                            <div>
                                <div className="text-xs text-gray-600 ">公牌 ({communityCards.length}/5)</div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {communityCards.map((card, index) => (
                                        <div key={index} className="relative group">
                                            <div className={`
                                                w-8 h-10 bg-white rounded shadow-sm border
                                                ${card.isRed ? 'border-red-300' : 'border-gray-300'}
                                                flex flex-col items-center justify-center p-1 text-xs
                                            `}>
                                                <div className={`font-bold ${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                    {card.display}
                                                </div>
                                                <div className={`${card.isRed ? 'text-red-600' : 'text-black'}`}>
                                                    {card.suitSymbol}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeCommunityCard(index)}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="移除这张牌"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>)
}
export default PokerAnalyzerPage