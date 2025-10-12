import Race from "./pages/Race/Race"

const App = () => (
    // <div className={styles.main}>Biathlon manager is coming...</div>
    <Race laps={3} athletes={[
        {
            id: "1",
            name: "Alex Lopez",
            speed: {
                flat: 1,
                uphill: 0.5,
                downhill: 1.5,
            },
            stamina: 100,
            shootingAccuracy:90
        }
    ]} />
)

export default App
