function BlitzTable() {
  return (
    <>
            <table className="leaderboard-table" id="leaderboard">
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Spec</th>
                <th>Blitz Rating</th>
                <th>BG XP</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body">
      {data.map((player) => {
        return (
          <>
            <tr id={player._id}>
              <td>
                <img
                  style="width: 3rem; height: 3rem;"
                  alt="Char IMG"
                  src={player.media.avatar}
                />
              </td>
              <td>
                <b>{(data.indexOf(player)) + 1}.</b> {player.name}
              </td>
              <td>
                <b>{player.spec}</b> ({player.class})
              </td>
              <td>{player.rating['solo_blitz']}</td>
              <td>
                Grand Marshal
                <br />
                <b> 2400</b>
              </td>
            </tr>
          </>
        );
      })}
      </tbody>
    </table>
      
    </section>
    </>
  );
}
