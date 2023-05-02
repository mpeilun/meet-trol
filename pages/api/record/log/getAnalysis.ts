import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../prisma/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import {
  Actions,
  AllAnalyticsLogActions,
  AnalysisLogs,
  AnalyticsLog,
  Feedbacks,
  InteractionAction,
  InteractionLog,
  UserAnalyticsLog,
  allInteractionType,
} from '../../../../types/videoLog'
import { time } from 'console'
import { isFocusOnVideo, transformXY } from '../../../../util/calculate'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const { courseId, videoId } = req.query as {
    courseId?: string
    videoId?: string
  }
  const isEmpty = (obj: {}): boolean => {
    return Object.keys(obj).length === 0
  }

  const isValidObjectId = (id: string): boolean => {
    return typeof id === 'string' && id.length === 24 && /^[a-f0-9]+$/i.test(id)
  }

  // 判斷登入
  if (session) {
    // GET DATA
    if (req.method === 'GET') {
      if (courseId && videoId) {
        if (isValidObjectId(courseId) && isValidObjectId(videoId)) {
          const record = await prisma.record.findFirst({
            where: {
              courseId: courseId,
              userId: session.user.id,
            },
            select: { id: true },
          })
          if (record) {
            const videos = await prisma.course.findUnique({
              where: {
                id: courseId,
              },
              select: {
                chapters: {
                  select: {
                    videos: { select: { id: true } },
                  },
                },
              },
            })
            // 建立課程 video 資料
            const videoList = videos.chapters
              .map(({ videos }) => videos.map(({ id }) => id))
              .flat()
            // 判斷videoId是否為課程內的video
            if (videoList.includes(videoId)) {
              // 建立 pastView 資料
              const pastView = await prisma.pastView.findFirst({
                where: {
                  videoId: videoId,
                  recordId: record.id,
                },
              })
              // 判斷是否有pastView
              if (pastView) {
                const check = await prisma.course.findUnique({
                  where: {
                    id: courseId,
                  },
                  select: {
                    ownerId: true,
                  },
                })
                if (check.ownerId.includes(session.user.id)) {
                  const allUserData = await prisma.record.findMany({
                    where: {
                      courseId: courseId,
                      pastView: {
                        some: {
                          videoId: videoId,
                        },
                      },
                    },
                    select: {
                      userId: true,
                      pastView: {
                        select: {
                          viewLogs: true,
                        },
                      },
                    },
                  })
                  await Promise.all(
                    allUserData.map(async ({ pastView, userId }) => {
                      const userInfo = await prisma.user.findUnique({
                        where: {
                          id: userId,
                        },
                        select: {
                          id: true,
                          email: true,
                          name: true,
                        },
                      })
                    })
                  )

                  const allAnalyticsLogs: UserAnalyticsLog = {}
                  const allInteractionLogs: Array<InteractionLog[]> = []
                  const allAnalyticsLogActions: AnalysisLogs = {}

                  for (let i = 0; i < allUserData.length; i++) {
                    const analyticsLogs: AnalyticsLog[] = []
                    const analyticsLogActions: Actions[][] = []
                    const interactionLogs: InteractionLog[] = []
                    const userId = allUserData[i].userId
                    const userInfo = await prisma.user.findUnique({
                      where: {
                        id: userId,
                      },
                      select: {
                        id: true,
                        email: true,
                        name: true,
                      },
                    })
                    const email = userInfo.email
                    const name = userInfo.name
                    const startFillFormTime =
                      await prisma.informedConsent.findUnique({
                        where: {
                          userId: userId,
                        },
                        select: {
                          createdAt: true,
                        },
                      })

                    // 開始填寫前置問卷時間
                    const enterPreFormTime = startFillFormTime.createdAt

                    for (
                      let j = 0;
                      j < allUserData[i].pastView[0].viewLogs.length;
                      j++
                    ) {
                      {
                        const analyticsLog: AnalyticsLog = {}
                        const analyticsLogAction: Actions[] = []

                        // 總影片總焦點時長
                        let totalVideoFocusTime = 0
                        // 影片背景撥放時間
                        let totalOutVideoWatchTime = 0
                        // 影片總撥放時間
                        const totalVideoWatchTime =
                          allUserData[i].pastView[0].viewLogs[j].eyesTrack
                            .length - 1
                        // 影片總暫停時間(包含閱讀題目)
                        let totalVideoPauseTime = 0
                        // 總互動開啟時長
                        let totalInteractionTime = 0
                        // 總題目焦點時長
                        let totalFocusOnInteractionTime = 0
                        // 第一次進入頁面時間
                        const enterVideoTime =
                          allUserData[i].pastView[0].viewLogs[j].watchTime.start
                            .time
                        // 開始填後側問卷時間
                        const leaveVideoTime =
                          allUserData[i].pastView[0].viewLogs[j].watchTime.end
                            .time
                        // 開始撥放影片時間
                        const videoStartTime =
                          allUserData[i].pastView[0].viewLogs[j].eyesTrack[1]
                            .time

                        const videoInteraction = await prisma.video.findUnique({
                          where: {
                            id: videoId,
                          },
                          select: {
                            choice: {
                              select: {
                                id: true,
                                questionType: true,
                                feedback: {
                                  where: {
                                    userId: userId,
                                    createdAt: {
                                      gte: enterVideoTime,
                                      lte: leaveVideoTime,
                                    },
                                  },
                                  select: {
                                    isCorrect: true,
                                    createdAt: true,
                                  },
                                },
                              },
                            },
                            rank: {
                              select: {
                                id: true,
                                questionType: true,
                                feedback: {
                                  where: {
                                    userId: userId,
                                    createdAt: {
                                      gte: enterVideoTime,
                                      lte: leaveVideoTime,
                                    },
                                  },
                                  select: {
                                    isCorrect: true,
                                    createdAt: true,
                                  },
                                },
                              },
                            },
                            fill: {
                              select: {
                                id: true,
                                questionType: true,
                                feedback: {
                                  where: {
                                    userId: userId,
                                    createdAt: {
                                      gte: enterVideoTime,
                                      lte: leaveVideoTime,
                                    },
                                  },
                                  select: {
                                    isCorrect: true,
                                    createdAt: true,
                                  },
                                },
                              },
                            },
                            drag: {
                              select: {
                                id: true,
                                questionType: true,
                                feedback: {
                                  where: {
                                    userId: userId,
                                    createdAt: {
                                      gte: enterVideoTime,
                                      lte: leaveVideoTime,
                                    },
                                  },
                                  select: {
                                    isCorrect: true,
                                    createdAt: true,
                                  },
                                },
                              },
                            },
                          },
                        })

                        const { choice, rank, fill, drag } = videoInteraction

                        const interactionList: allInteractionType[] = [
                          ...choice,
                          ...rank,
                          ...fill,
                          ...drag,
                        ]

                        const feedbackTimes: Feedbacks[] = []
                        interactionList.map((interaction) => {
                          interaction.feedback.map((feedback) => {
                            feedbackTimes.push({
                              id: interaction.id,
                              createdAt: feedback.createdAt,
                              isCorrect: feedback.isCorrect,
                              questionType: interaction.questionType,
                            })
                          })
                        })

                        const compare = (a: Feedbacks, b: Feedbacks) => {
                          return a.createdAt.getTime() - b.createdAt.getTime()
                        }
                        const compare2 = (a: Actions, b: Actions) => {
                          return a.time.getTime() - b.time.getTime()
                        }
                        feedbackTimes.sort(compare)
                        // 紀錄進入時間
                        analyticsLog[enterVideoTime.toLocaleString()] = {
                          status: 'enter',
                          playSecond: Math.round(
                            allUserData[i].pastView[0].viewLogs[j].watchTime
                              .start.playSecond
                          ),
                        }
                        analyticsLogAction.push({
                          time: enterVideoTime,
                          action: {
                            status: 'enter',
                            playSecond: Math.round(
                              allUserData[i].pastView[0].viewLogs[j].watchTime
                                .start.playSecond
                            ),
                          },
                        })
                        // const eyesTrackTimes =
                        //   allUserData[i].pastView[0].viewLogs[j].eyesTrack
                        // const pauseTimes =
                        //   allUserData[i].pastView[0].viewLogs[j].pauseTimes
                        // const dragTimes =
                        //   allUserData[i].pastView[0].viewLogs[j].dragTimes
                        // const interactionTimes =
                        //   allUserData[i].pastView[0].viewLogs[j].interactionLog
                        // const eyesTrackLength = eyesTrackTimes.length
                        // const pauseLength = pauseTimes.length
                        // const dragLength = dragTimes.length
                        // const interactionLength = interactionTimes.length
                        // const feedbackLength = feedbackTimes.length
                        // const eyesTrackIndex = 1
                        // const pauseIndex = 1
                        // const dragIndex = 0
                        // const interactionIndex = 0
                        // const feedbackIndex = 0
                        // while (
                        //   eyesTrackIndex < eyesTrackLength ||
                        //   pauseIndex < pauseLength ||
                        //   dragIndex < dragLength ||
                        //   interactionIndex < interactionLength ||
                        //   feedbackIndex < feedbackLength
                        // ) {
                        // }

                        // 紀錄影片撥放時間
                        allUserData[i].pastView[0].viewLogs[j].eyesTrack.map(
                          (eyesTrack, index) => {
                            const eyesTrackT = transformXY({
                              x: eyesTrack.x,
                              y: eyesTrack.y,
                              playerX:
                                eyesTrack.playerX ?? eyesTrack.windowsW / 4.9,
                              playerY: eyesTrack.playerY ?? 68.5,
                              playerW: eyesTrack.playerW,
                              playerH: eyesTrack.playerH,
                              widthRate: 16,
                              heightRate: 9,
                            })
                            if (index > 0) {
                              if (eyesTrack.focus.onWindow) {
                                if (eyesTrackT) {
                                  analyticsLogAction.push({
                                    time: eyesTrack.time,
                                    action: {
                                      status: 'play',
                                      playSecond: Math.round(
                                        eyesTrack.focus.playSecond
                                      ),
                                      x: eyesTrackT.x,
                                      y: eyesTrackT.y,
                                      playerW: eyesTrackT.playerW,
                                      playerH: eyesTrackT.playerH,
                                    },
                                  })
                                } else {
                                  analyticsLogAction.push({
                                    time: eyesTrack.time,
                                    action: {
                                      status: 'play',
                                      playSecond: Math.round(
                                        eyesTrack.focus.playSecond
                                      ),
                                    },
                                  })
                                }
                                analyticsLog[eyesTrack.time.toLocaleString()] =
                                  {
                                    status: 'play',
                                    playSecond: Math.round(
                                      eyesTrack.focus.playSecond
                                    ),
                                    // x: eyesTrack.x,
                                    // y: eyesTrack.y,
                                  }
                              } else {
                                if (eyesTrackT) {
                                  analyticsLogAction.push({
                                    time: eyesTrack.time,
                                    action: {
                                      status: 'play-background',
                                      playSecond: Math.round(
                                        eyesTrack.focus.playSecond
                                      ),
                                      x: eyesTrackT.x,
                                      y: eyesTrackT.y,
                                      playerW: eyesTrackT.playerW,
                                      playerH: eyesTrackT.playerH,
                                    },
                                  })
                                } else {
                                  analyticsLogAction.push({
                                    time: eyesTrack.time,
                                    action: {
                                      status: 'play-background',
                                      playSecond: Math.round(
                                        eyesTrack.focus.playSecond
                                      ),
                                    },
                                  })
                                }

                                analyticsLog[eyesTrack.time.toLocaleString()] =
                                  {
                                    status: 'play-background',
                                    playSecond: Math.round(
                                      eyesTrack.focus.playSecond
                                    ),
                                  }
                              }
                            }
                          }
                        )
                        // 記錄暫停時間
                        allUserData[i].pastView[0].viewLogs[j].pauseTimes.map(
                          (pauseTrack, index) => {
                            if (index > 0) {
                              const duration =
                                pauseTrack.playTime.getTime() -
                                pauseTrack.pauseTime.getTime()
                              totalVideoPauseTime += duration

                              analyticsLogAction.push({
                                time: pauseTrack.pauseTime,
                                action: {
                                  status: 'pause',
                                  playSecond: Math.round(pauseTrack.playSecond),
                                },
                              })

                              analyticsLog[
                                pauseTrack.pauseTime.toLocaleString()
                              ] = {
                                status: 'pause',
                                playSecond: Math.round(pauseTrack.playSecond),
                              }
                            }
                          }
                        )

                        totalVideoPauseTime = Math.round(
                          totalVideoPauseTime / 1000
                        )
                        // 記錄拖曳時間
                        allUserData[i].pastView[0].viewLogs[j].dragTimes.map(
                          (dragTrack) => {
                            analyticsLogAction.push({
                              time: dragTrack.time,
                              action: {
                                status: 'drag',
                                playSecond: Math.round(dragTrack.playSecond),
                              },
                            })

                            analyticsLog[dragTrack.time.toLocaleString()] = {
                              status: 'drag',
                              playSecond: Math.round(dragTrack.playSecond),
                            }
                          }
                        )
                        // TODO: instead hard code for set question type
                        // const info1Id: string = '6436eca765146d79a3901c3a'
                        // const info2Id: string = '6433dfd963a37fb092f46f51'
                        // const choice1Id: string = '6433e16963a37fb092f46f52'
                        // const choice2Id: string = '64340a97ec2f63e3fe7b8761'
                        // const rankId: string = '6433f3af63a37fb092f46f53'
                        // const fillId: string = '6433fec163a37fb092f46f55'
                        // const dragId: string = '6434070dec2f63e3fe7b875e'

                        // let choice1CorrectTimes = 0
                        // let choice2CorrectTimes = 0
                        // let rankCorrectTimes = 0
                        // let fillCorrectTimes = 0
                        // let dragCorrectTimes = 0

                        // let choice1AnswerTimes = 0
                        // let choice2AnswerTimes = 0
                        // let rankAnswerTimes = 0
                        // let fillAnswerTimes = 0
                        // let dragAnswerTimes = 0

                        // let info1OpenTimes = 0
                        // let info2OpenTimes = 0
                        // let choice1OpenTimes = 0
                        // let choice2OpenTimes = 0
                        // let rankOpenTimes = 0
                        // let fillOpenTimes = 0
                        // let dragOpenTimes = 0

                        // let info1FocusLength = 0
                        // let info2FocusLength = 0
                        // let choice1FocusLength = 0
                        // let choice2FocusLength = 0
                        // let rankFocusLength = 0
                        // let fillFocusLength = 0
                        // let dragFocusLength = 0

                        // let info1OpenLength = 0
                        // let info2OpenLength = 0
                        // let choice1OpenLength = 0
                        // let choice2OpenLength = 0
                        // let rankOpenLength = 0
                        // let fillOpenLength = 0
                        // let dragOpenLength = 0

                        // let choice1FirstOpenTime = new Date('2025-04-18')
                        // let choice2FirstOpenTime = new Date('2025-04-18')
                        // let rankFirstOpenTime = new Date('2025-04-18')
                        // let fillFirstOpenTime = new Date('2025-04-18')
                        // let dragFirstOpenTime = new Date('2025-04-18')

                        // let choice1FirstCloseTime = new Date('2025-04-18')
                        // let choice2FirstCloseTime = new Date('2025-04-18')
                        // let rankFirstCloseTime = new Date('2025-04-18')
                        // let fillFirstCloseTime = new Date('2025-04-18')
                        // let dragFirstCloseTime = new Date('2025-04-18')

                        // let choice1LastCloseTime = new Date('2022-04-18')
                        // let choice2LastCloseTime = new Date('2022-04-18')
                        // let rankLastCloseTime = new Date('2022-04-18')
                        // let fillLastCloseTime = new Date('2022-04-18')
                        // let dragLastCloseTime = new Date('2022-04-18')

                        // let choice1IsFirstInAnswer = false
                        // let choice2IsFirstInAnswer = false
                        // let rankIsFirstInAnswer = false
                        // let fillIsFirstInAnswer = false
                        // let dragIsFirstInAnswer = false

                        // 記錄互動時間
                        allUserData[i].pastView[0].viewLogs[
                          j
                        ].interactionLog.map(
                          ({ openTime, closeTime, questionId, focusTime }) => {
                            const playSecond =
                              analyticsLog[closeTime.toLocaleString()]
                                ?.playSecond ??
                              analyticsLog[openTime.toLocaleString()]
                                ?.playSecond
                            const duration =
                              closeTime.getTime() - openTime.getTime()
                            totalInteractionTime += duration
                            totalFocusOnInteractionTime += focusTime

                            analyticsLogAction.push({
                              time: openTime,
                              action: {
                                status: 'openInteraction',
                              },
                            })
                            analyticsLogAction.push({
                              time: closeTime,
                              action: {
                                status: 'closeInteraction',
                              },
                            })
                            // if (questionId === choice1Id) {
                            //   choice1OpenTimes += 1
                            //   choice1FocusLength += focusTime
                            //   if (choice1OpenLength === 0) {
                            //     choice1FirstCloseTime = closeTime
                            //   }
                            //   choice1OpenLength += duration
                            //   choice1FirstOpenTime =
                            //     openTime < choice1FirstOpenTime
                            //       ? openTime
                            //       : choice1FirstOpenTime
                            //   choice1LastCloseTime =
                            //     closeTime > choice1LastCloseTime
                            //       ? closeTime
                            //       : choice1LastCloseTime
                            // } else if (questionId === choice2Id) {
                            //   choice2OpenTimes += 1
                            //   choice2FocusLength += focusTime
                            //   if (choice2OpenLength === 0) {
                            //     choice2FirstCloseTime = closeTime
                            //   }
                            //   choice2OpenLength += duration
                            //   choice2FirstOpenTime =
                            //     openTime < choice2FirstOpenTime
                            //       ? openTime
                            //       : choice2FirstOpenTime
                            //   choice2LastCloseTime =
                            //     closeTime > choice2LastCloseTime
                            //       ? closeTime
                            //       : choice2LastCloseTime
                            // } else if (questionId === rankId) {
                            //   rankOpenTimes += 1
                            //   rankFocusLength += focusTime
                            //   if (rankOpenLength === 0) {
                            //     rankFirstCloseTime = closeTime
                            //   }
                            //   rankOpenLength += duration
                            //   rankFirstOpenTime =
                            //     openTime < rankFirstOpenTime
                            //       ? openTime
                            //       : rankFirstOpenTime
                            //   rankLastCloseTime =
                            //     closeTime > rankLastCloseTime
                            //       ? closeTime
                            //       : rankLastCloseTime
                            // } else if (questionId === fillId) {
                            //   fillOpenTimes += 1
                            //   fillFocusLength += focusTime
                            //   if (fillOpenLength === 0) {
                            //     fillFirstCloseTime = closeTime
                            //   }
                            //   fillOpenLength += duration
                            //   fillFirstOpenTime =
                            //     openTime < fillFirstOpenTime
                            //       ? openTime
                            //       : fillFirstOpenTime
                            //   fillLastCloseTime =
                            //     closeTime > fillLastCloseTime
                            //       ? closeTime
                            //       : rankLastCloseTime
                            // } else if (questionId === dragId) {
                            //   dragOpenTimes += 1
                            //   dragFocusLength += focusTime
                            //   if (dragOpenLength === 0) {
                            //     dragFirstCloseTime = closeTime
                            //   }
                            //   dragOpenLength += duration
                            //   dragFirstOpenTime =
                            //     openTime < dragFirstOpenTime
                            //       ? openTime
                            //       : dragFirstOpenTime
                            //   dragLastCloseTime =
                            //     closeTime > dragLastCloseTime
                            //       ? closeTime
                            //       : rankLastCloseTime
                            // } else if (questionId === info1Id) {
                            //   info1OpenTimes += 1
                            //   info1FocusLength += focusTime
                            //   info1OpenLength += duration
                            // } else if (questionId === info2Id) {
                            //   info2OpenTimes += 1
                            //   info2FocusLength += focusTime
                            //   info2OpenLength += duration
                            // }

                            if (
                              analyticsLog[openTime.toLocaleString()]
                                ?.status === 'drag'
                            ) {
                              analyticsLog[
                                new Date(
                                  openTime.getTime() + 1000
                                ).toLocaleString()
                              ] = {
                                status: 'openInteraction',
                                playSecond: playSecond,
                                questionId: questionId,
                                focusTime: focusTime,
                              }
                              if (openTime.getTime() === closeTime.getTime()) {
                                analyticsLog[
                                  new Date(
                                    closeTime.getTime() + 2000
                                  ).toLocaleString()
                                ] = {
                                  status: 'closeInteraction',
                                  playSecond: playSecond,
                                }
                              } else {
                                analyticsLog[closeTime.toLocaleString()] = {
                                  status: 'closeInteraction',
                                  playSecond: playSecond,
                                }
                              }
                            } else {
                              if (openTime.getTime() === closeTime.getTime()) {
                                analyticsLog[openTime.toLocaleString()] = {
                                  status: 'openInteraction',
                                  playSecond: playSecond,
                                  questionId: questionId,
                                  focusTime: focusTime,
                                }
                                analyticsLog[
                                  new Date(
                                    closeTime.getTime() + 1000
                                  ).toLocaleString()
                                ] = {
                                  status: 'closeInteraction',
                                  playSecond: playSecond,
                                }
                              } else {
                                analyticsLog[openTime.toLocaleString()] = {
                                  status: 'openInteraction',
                                  playSecond: playSecond,
                                  questionId: questionId,
                                  focusTime: focusTime,
                                }
                                analyticsLog[closeTime.toLocaleString()] = {
                                  status: 'closeInteraction',
                                  playSecond: playSecond,
                                }
                              }
                            }
                          }
                        )
                        totalInteractionTime = Math.round(
                          totalInteractionTime / 1000
                        )

                        // 記錄作答紀錄

                        feedbackTimes.map((feedback) => {
                          analyticsLogAction.push({
                            time: feedback.createdAt,
                            action: {
                              status: 'closeInteraction',
                              isCorrect: feedback.isCorrect,
                              questionId: feedback.id,
                              questionType: feedback.questionType,
                            },
                          })
                        })
                        // TODO: instead of hard code, use questionType to determine the answer
                        interactionList.map((interaction) => {
                          interaction.feedback.map((feedback) => {
                            analyticsLog[
                              `Answer${feedback.createdAt.toLocaleString()}`
                            ] = {
                              status: 'submitAnswer',
                              questionId: interaction.id,
                              questionType: interaction.questionType,
                              isCorrect: feedback.isCorrect,
                            }
                          })

                          // 單選 1
                          // if (interaction.id === choice1Id) {
                          //   const answer = [1]
                          //   interaction.feedback.map((feedback) => {
                          //     choice1AnswerTimes += 1
                          //     if (check(feedback.answers, answer)) {
                          //       choice1CorrectTimes += 1
                          //     }
                          //     if (
                          //       feedback.createdAt > choice1FirstOpenTime &&
                          //       feedback.createdAt < choice1FirstCloseTime
                          //     ) {
                          //       choice1IsFirstInAnswer = true
                          //     }

                          //     analyticsLog[
                          //       `Answer${feedback.createdAt.toLocaleString()}`
                          //     ] = {
                          //       status: 'submitAnswer',
                          //       questionId: interaction.id,
                          //       isCorrect: check(feedback.answers, answer),
                          //     }
                          //   })
                          // }
                          // 單選 2
                          // else if (interaction.id === choice2Id) {
                          //   const answer = [2]
                          //   interaction.feedback.map((feedback) => {
                          //     choice2AnswerTimes += 1
                          //     if (check(feedback.answers, answer)) {
                          //       choice2CorrectTimes += 1
                          //     }
                          //     if (
                          //       feedback.createdAt > choice2FirstOpenTime &&
                          //       feedback.createdAt < choice2FirstCloseTime
                          //     ) {
                          //       choice2IsFirstInAnswer = true
                          //     }

                          //     analyticsLog[
                          //       `Answer${feedback.createdAt.toLocaleString()}`
                          //     ] = {
                          //       status: 'submitAnswer',
                          //       questionId: interaction.id,
                          //       isCorrect: check(feedback.answers, answer),
                          //     }
                          //   })
                          // }
                          // 排序
                          // else if (interaction.id === rankId) {
                          //   const answer = [
                          //     '工作記憶區',
                          //     '尋找是否有相符的舊資訊，產生思考',
                          //     '長期記憶區',
                          //   ]
                          //   interaction.feedback.map((feedback) => {
                          //     rankAnswerTimes += 1
                          //     if (check(feedback.answers, answer)) {
                          //       rankCorrectTimes += 1
                          //     }
                          //     if (
                          //       feedback.createdAt > rankFirstOpenTime &&
                          //       feedback.createdAt < rankFirstCloseTime
                          //     ) {
                          //       rankIsFirstInAnswer = true
                          //     }

                          //     analyticsLog[
                          //       `Answer${feedback.createdAt.toLocaleString()}`
                          //     ] = {
                          //       status: 'submitAnswer',
                          //       questionId: interaction.id,
                          //       isCorrect: check(feedback.answers, answer),
                          //     }
                          //   })
                          // }
                          // 填充
                          // else if (interaction.id === fillId) {
                          //   const answer = ['長期記憶']
                          //   interaction.feedback.map((feedback) => {
                          //     fillAnswerTimes += 1
                          //     if (check(feedback.answers, answer)) {
                          //       fillCorrectTimes += 1
                          //     }
                          //     if (
                          //       feedback.createdAt > fillFirstOpenTime &&
                          //       feedback.createdAt < fillFirstCloseTime
                          //     ) {
                          //       fillIsFirstInAnswer = true
                          //     }

                          //     analyticsLog[
                          //       `Answer${feedback.createdAt.toLocaleString()}`
                          //     ] = {
                          //       status: 'submitAnswer',
                          //       questionId: interaction.id,
                          //       isCorrect: check(feedback.answers, answer),
                          //     }
                          //   })
                          // }
                          // 拖曳
                          // else if (interaction.id === dragId) {
                          //   const answer = [320, 157, 320 + 212, 157 + 105]
                          //   interaction.feedback.map((feedback) => {
                          //     dragAnswerTimes += 1
                          //     if (
                          //       feedback.answers[0].x > answer[0] &&
                          //       feedback.answers[0].x < answer[2] &&
                          //       feedback.answers[0].y > answer[1] &&
                          //       feedback.answers[0].y < answer[3]
                          //     ) {
                          //       dragCorrectTimes += 1
                          //     }
                          //     if (
                          //       feedback.createdAt > dragFirstOpenTime &&
                          //       feedback.createdAt < dragFirstCloseTime
                          //     ) {
                          //       dragIsFirstInAnswer = true
                          //     }
                          //     analyticsLog[
                          //       `Answer${feedback.createdAt.toLocaleString()}`
                          //     ] = {
                          //       status: 'submitAnswer',
                          //       questionId: interaction.id,
                          //       isCorrect:
                          //         feedback.answers[0].x > answer[0] &&
                          //         feedback.answers[0].x < answer[2] &&
                          //         feedback.answers[0].y > answer[1] &&
                          //         feedback.answers[0].y < answer[3],
                          //     }
                          //   })
                          // }
                        })
                        // 記錄離開時間
                        analyticsLog[leaveVideoTime.toLocaleString()] = {
                          status: 'leave',
                          playSecond: Math.round(
                            allUserData[i].pastView[0].viewLogs[j].watchTime.end
                              .playSecond
                          ),
                        }
                        analyticsLogAction.push({
                          time: leaveVideoTime,
                          action: {
                            status: 'leave',
                            playSecond: Math.round(
                              allUserData[i].pastView[0].viewLogs[j].watchTime
                                .end.playSecond
                            ),
                          },
                        })

                        // const choice1CorrectRate =
                        //   choice1CorrectTimes / choice1AnswerTimes
                        // const choice2CorrectRate =
                        //   choice2CorrectTimes / choice2AnswerTimes
                        // const rankCorrectRate =
                        //   rankCorrectTimes / rankAnswerTimes
                        // const fillCorrectRate =
                        //   fillCorrectTimes / fillAnswerTimes
                        // const dragCorrectRate =
                        //   dragCorrectTimes / dragAnswerTimes

                        // const totalOpenInteractionTimes =
                        //   choice1OpenTimes +
                        //   choice2OpenTimes +
                        //   rankOpenTimes +
                        //   fillOpenTimes +
                        //   dragOpenTimes

                        // const totalOnVideoWatchTime =
                        //   totalVideoWatchTime - totalOutVideoWatchTime

                        // const choice1InteractionAction: InteractionAction = {
                        //   questionId: choice1Id,
                        //   questionType: 'choice',
                        //   answerTimes: choice1AnswerTimes,
                        //   correctRate: choice1CorrectTimes / choice1AnswerTimes,
                        //   openInteractionTimes: choice1OpenTimes,
                        //   focusOnInteractionLength: choice1FocusLength,
                        //   totalOpenLength: Math.round(choice1OpenLength / 1000),
                        //   isFirstInAnswer: choice1IsFirstInAnswer,
                        // }
                        // const choice2InteractionAction: InteractionAction = {
                        //   questionId: choice2Id,
                        //   questionType: 'choice',
                        //   answerTimes: choice2AnswerTimes,
                        //   correctRate: choice2CorrectTimes / choice2AnswerTimes,
                        //   openInteractionTimes: choice2OpenTimes,
                        //   focusOnInteractionLength: choice2FocusLength,
                        //   totalOpenLength: Math.round(choice2OpenLength / 1000),
                        //   isFirstInAnswer: choice2IsFirstInAnswer,
                        // }
                        // const rankInteractionAction: InteractionAction = {
                        //   questionId: rankId,
                        //   questionType: 'rank',
                        //   answerTimes: rankAnswerTimes,
                        //   correctRate: rankCorrectTimes / rankAnswerTimes,
                        //   openInteractionTimes: rankOpenTimes,
                        //   focusOnInteractionLength: rankFocusLength,
                        //   totalOpenLength: Math.round(rankOpenLength / 1000),
                        //   isFirstInAnswer: rankIsFirstInAnswer,
                        // }
                        // const fillInteractionAction: InteractionAction = {
                        //   questionId: fillId,
                        //   questionType: 'fill',
                        //   answerTimes: fillAnswerTimes,
                        //   correctRate: fillCorrectTimes / fillAnswerTimes,
                        //   openInteractionTimes: fillOpenTimes,
                        //   focusOnInteractionLength: fillFocusLength,
                        //   totalOpenLength: Math.round(fillOpenLength / 1000),
                        //   isFirstInAnswer: fillIsFirstInAnswer,
                        // }
                        // const dragInteractionAction: InteractionAction = {
                        //   questionId: dragId,
                        //   questionType: 'drag',
                        //   answerTimes: dragAnswerTimes,
                        //   correctRate: dragCorrectTimes / dragAnswerTimes,
                        //   openInteractionTimes: dragOpenTimes,
                        //   focusOnInteractionLength: dragFocusLength,
                        //   totalOpenLength: Math.round(dragOpenLength / 1000),
                        //   isFirstInAnswer: dragIsFirstInAnswer,
                        // }
                        // const info1InteractionAction: InteractionAction = {
                        //   questionId: info1Id,
                        //   questionType: 'info',
                        //   openInteractionTimes: info1OpenTimes,
                        //   focusOnInteractionLength: info1FocusLength,
                        //   totalOpenLength: Math.round(info1OpenLength / 1000),
                        // }
                        // const info2InteractionAction: InteractionAction = {
                        //   questionId: info2Id,
                        //   questionType: 'info',
                        //   openInteractionTimes: info2OpenTimes,
                        //   focusOnInteractionLength: info2FocusLength,
                        //   totalOpenLength: Math.round(info2OpenLength / 1000),
                        // }
                        // const interactionLog: InteractionLog = {
                        //   userId: userId,
                        //   email: email,
                        //   name: name,
                        //   totalStayTime: Math.round(
                        //     (leaveVideoTime.getTime() -
                        //       enterVideoTime.getTime()) /
                        //       1000
                        //   ),
                        //   totalVideoPlayLength: totalVideoWatchTime,
                        //   totalVideoPlayFrontLength: totalOnVideoWatchTime,
                        //   totalVideoPlayBackLength: totalOutVideoWatchTime,
                        //   totalVideoPauseLength: totalVideoPauseTime,
                        //   totalVideoFocusLength: totalVideoFocusTime,
                        //   totalInteractionLength: totalInteractionTime,
                        //   totalOpenInteractionTimes: totalOpenInteractionTimes,
                        //   totalFocusOnInteractionLength:
                        //     totalFocusOnInteractionTime,
                        //   totalQuestionCorrectRate:
                        //     (choice1CorrectRate +
                        //       choice2CorrectRate +
                        //       rankCorrectRate +
                        //       fillCorrectRate +
                        //       dragCorrectRate) /
                        //     5,
                        //   pauseTimes:
                        //     allUserData[i].pastView[0].viewLogs[j].pauseTimes
                        //       .length - 1,
                        //   dragTimes:
                        //     allUserData[i].pastView[0].viewLogs[j].dragTimes
                        //       .length,
                        //   enterWebTime: enterVideoTime.toLocaleString(),
                        //   videoStartTime: videoStartTime.toLocaleString(),
                        //   enterPreFormTime: enterPreFormTime.toLocaleString(),
                        //   enterPostFormTime: leaveVideoTime.toLocaleString(),
                        //   info1_questionId: info1Id,
                        //   info1_questionType: 'info',
                        //   info1_openInteractionTimes: info1OpenTimes,
                        //   info1_focusOnInteractionLength: info1FocusLength,
                        //   info1_totalOpenLength: Math.round(
                        //     info1OpenLength / 1000
                        //   ),
                        //   info2_questionId: info2Id,
                        //   info2_questionType: 'info',
                        //   info2_openInteractionTimes: info2OpenTimes,
                        //   info2_focusOnInteractionLength: info2FocusLength,
                        //   info2_totalOpenLength: Math.round(
                        //     info2OpenLength / 1000
                        //   ),
                        //   choice1_questionId: choice1Id,
                        //   choice1_questionType: 'choice',
                        //   choice1_answerTimes: choice1AnswerTimes,
                        //   choice1_correctRate: choice1CorrectRate,
                        //   choice1_openInteractionTimes: choice1OpenTimes,
                        //   choice1_focusOnInteractionLength: choice1FocusLength,
                        //   choice1_totalOpenLength: Math.round(
                        //     choice1OpenLength / 1000
                        //   ),
                        //   choice1_isFirstInAnswer: choice1IsFirstInAnswer,
                        //   choice2_questionId: choice2Id,
                        //   choice2_questionType: 'choice',
                        //   choice2_answerTimes: choice2AnswerTimes,
                        //   choice2_correctRate: choice2CorrectRate,
                        //   choice2_openInteractionTimes: choice2OpenTimes,
                        //   choice2_focusOnInteractionLength: choice2FocusLength,
                        //   choice2_totalOpenLength: Math.round(
                        //     choice2OpenLength / 1000
                        //   ),
                        //   choice2_isFirstInAnswer: choice2IsFirstInAnswer,
                        //   rank_questionId: rankId,
                        //   rank_questionType: 'rank',
                        //   rank_answerTimes: rankAnswerTimes,
                        //   rank_correctRate: rankCorrectRate,
                        //   rank_openInteractionTimes: rankOpenTimes,
                        //   rank_focusOnInteractionLength: rankFocusLength,
                        //   rank_totalOpenLength: Math.round(
                        //     rankOpenLength / 1000
                        //   ),
                        //   rank_isFirstInAnswer: rankIsFirstInAnswer,
                        //   fill_questionId: fillId,
                        //   fill_questionType: 'fill',
                        //   fill_answerTimes: fillAnswerTimes,
                        //   fill_correctRate: fillCorrectRate,
                        //   fill_openInteractionTimes: fillOpenTimes,
                        //   fill_focusOnInteractionLength: fillFocusLength,
                        //   fill_totalOpenLength: Math.round(
                        //     fillOpenLength / 1000
                        //   ),
                        //   fill_isFirstInAnswer: fillIsFirstInAnswer,
                        //   drag_questionId: dragId,
                        //   drag_questionType: 'drag',
                        //   drag_answerTimes: dragAnswerTimes,
                        //   drag_correctRate: dragCorrectRate,
                        //   drag_openInteractionTimes: dragOpenTimes,
                        //   drag_focusOnInteractionLength: dragFocusLength,
                        //   drag_totalOpenLength: Math.round(
                        //     dragOpenLength / 1000
                        //   ),
                        //   drag_isFirstInAnswer: dragIsFirstInAnswer,

                        // interactionActions: [
                        //   choice1InteractionAction,
                        //   choice2InteractionAction,
                        //   rankInteractionAction,
                        //   fillInteractionAction,
                        //   dragInteractionAction,
                        //   info1InteractionAction,
                        //   info2InteractionAction,
                        // ],
                        // }2
                        analyticsLogAction.sort(compare2)
                        analyticsLogs.push(analyticsLog)
                        analyticsLogActions.push(analyticsLogAction)
                        // interactionLogs.push(interactionLog)
                      }
                      allAnalyticsLogActions[userId] = {
                        name: name,
                        email: email,
                        logs: analyticsLogActions,
                      }
                      allAnalyticsLogs[userId] = analyticsLogs
                      // allInteractionLogs.push(interactionLogs)
                    }
                  }
                  return res.status(200).json(allAnalyticsLogActions)
                } else {
                  return res.status(403).json({ message: 'Forbidden' })
                }
              } else {
                // no pastView 課程無人觀課
                return res.status(200).json([])
              }
            } else {
              return res.status(400).json({ message: 'Bad Request' })
            }
          } else {
            // no record 課程無人加入
            return res.status(200).json([])
          }
        } else {
          return res.status(400).json({ message: 'Bad Request' })
        }
      } else {
        return res.status(400).json({ message: 'Bad Request' })
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowedbad request' })
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export default handler
