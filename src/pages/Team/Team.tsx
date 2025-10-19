import { mockedAthletes } from "../../mockedObjects/mockedAthletes"
import Athletes from "./components/Athletes/Athletes"
import PageHeader from "../../components/PageHeader/PageHeader.tsx";

const Team = () => {
    return (
        <>
            <PageHeader text="Моя команда" subText="Упарвляйте спортсменами вашей команды" />
            <Athletes athletes={mockedAthletes} />
        </>
    )
}

export default Team