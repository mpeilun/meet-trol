import RankQuestion from '../../components/rank/rank'
export default function Rank() {
  const testFunction = () => {}
  
  return (
    <>
      <div>
        <RankQuestion
          displayQuestion={true}
          handleQuestionClose={testFunction}
        ></RankQuestion>
      </div>
    </>
  )
}
