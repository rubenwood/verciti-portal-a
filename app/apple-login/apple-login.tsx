
export default function AppleLogin(props: any){

    return(
        <>
            <button
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 999999,
                    background: "red",
                }}
                onClick={() => alert("WORKS")}
                >
                TEST
            </button>
        </>
    )
}