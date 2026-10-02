// ============================================================
// H2H VIEW
// ============================================================

function renderH2H(){
  const el = document.getElementById("view-h2h");
  if(!el) return;

  let html = `<div class="h2h-search">
    <input type="text" class="h2h-input" id="h2hViewTeam1"
           placeholder="🔍 Team 1..." value="${h2hView.team1}"
           autocomplete="off">
    <span class="h2h-vs">VS</span>
    <input type="text" class="h2h-input" id="h2hViewTeam2"
           placeholder="🔍 Team 2..." value="${h2hView.team2}"
           autocomplete="off">
    <button class="h2h-clear" id="h2hViewClear" title="Καθαρισμός">✕</button>
  </div>`;

  const data = computeH2H(h2hView.team1, h2hView.team2);

  if(!data){
    html += `<div class="empty">
      <span class="icon">🏀</span>
      <p>Γράψε δύο ομάδες για να δεις το Head-to-Head.</p>
      <p style="margin-top:8px;font-size:12px;color:var(--muted2)">
        π.χ. <code>OLY</code> vs <code>REAL</code>
      </p>
    </div>`;
    el.innerHTML = html;
    bindH2HInputs();
    attachAutocomplete(document.getElementById("h2hViewTeam1"));
    attachAutocomplete(document.getElementById("h2hViewTeam2"));
    return;
  }

  const { team1, team2, games: h2hGames, played, t1Wins, t2Wins, t1PF, t2PF, t1Diff } = data;
  const totalPlayed = played || 0;

  const leader = t1Wins > t2Wins ? team1 : t2Wins > t1Wins ? team2 : null;

  html += `
    <div class="h2h-header">
      <div class="h2h-side h2h-side-1">
        <div class="h2h-big-logo">${logoHTML(team1)}</div>
        <div class="h2h-team-name">${team1}</div>
        <div class="h2h-team-wins">${t1Wins}</div>
        <div class="h2h-team-wins-label">νίκες</div>
        <div class="h2h-team-pf">${t1PF} πόντοι</div>
      </div>
      <div class="h2h-center">
        <div class="h2h-vs-big">VS</div>
        <div class="h2h-total-games">${totalPlayed} παιχνίδια</div>
        ${leader
          ? `<div class="h2h-leader-big">🏆 ${leader}</div>`
          : totalPlayed > 0
            ? `<div class="h2h-leader-big h2h-draw">Ισοπαλία</div>`
            : `<div class="h2h-leader-big h2h-pending">Δεν έχουν παιχτεί ακόμα</div>`
        }
        ${totalPlayed > 0 ? `<div class="h2h-diff">Διαφορά: ${t1Diff > 0 ? "+" : ""}${t1Diff}</div>` : ""}
      </div>
      <div class="h2h-side h2h-side-2">
        <div class="h2h-big-logo">${logoHTML(team2)}</div>
        <div class="h2h-team-name">${team2}</div>
        <div class="h2h-team-wins">${t2Wins}</div>
        <div class="h2h-team-wins-label">νίκες</div>
        <div class="h2h-team-pf">${t2PF} πόντοι</div>
      </div>
    </div>

    <h3 class="h2h-section-title">📅 Όλα τα μεταξύ τους παιχνίδια</h3>
    <table class="h2h-table"><thead><tr>
      <th class="num">R</th>
      <th>Date</th>
      <th>Home</th>
      <th class="center">Score</th>
      <th class="center">Score</th>
      <th>Away</th>
      <th>Winner</th>
    </tr></thead><tbody>`;

  h2hGames.forEach(g => {
    const isPlayed = g.hs !== null && g.aw !== null;
    const homeWin = isPlayed && g.hs > g.aw;
    const awayWin = isPlayed && g.aw > g.hs;
    const winner = homeWin ? g.home : awayWin ? g.away : "";
    const homeClass = homeWin ? "winner-home" : "";
    const awayClass = awayWin ? "winner-away" : "";
    html += `<tr class="${homeClass} ${awayClass}">
      <td class="num">${g.round}</td>
      <td>${g.date}</td>
      <td class="home-col"><div class="team-cell">${logoHTML(g.home)}<span>${g.home}</span></div></td>
      <td class="center"><b>${isPlayed ? g.hs : "—"}</b></td>
      <td class="center"><b>${isPlayed ? g.aw : "—"}</b></td>
      <td class="away-col"><div class="team-cell">${logoHTML(g.away)}<span>${g.away}</span></div></td>
      <td class="winner-cell">${winner ? logoHTML(winner) + winner : "<span style='color:var(--muted2)'>Αναμένεται</span>"}</td>
    </tr>`;
  });

  html += `</tbody></table>`;
  el.innerHTML = html;

  bindH2HInputs();
  attachAutocomplete(document.getElementById("h2hViewTeam1"));
  attachAutocomplete(document.getElementById("h2hViewTeam2"));
}

function bindH2HInputs(){
  const in1 = document.getElementById("h2hViewTeam1");
  const in2 = document.getElementById("h2hViewTeam2");
  const clearBtn = document.getElementById("h2hViewClear");

  if(in1){
    in1.addEventListener("input", e => {
      h2hView.team1 = e.target.value;
      const pos = e.target.selectionStart;
      renderH2H();
      const ni = document.getElementById("h2hViewTeam1");
      if(ni){ ni.focus(); ni.setSelectionRange(pos, pos); }
    });
  }
  if(in2){
    in2.addEventListener("input", e => {
      h2hView.team2 = e.target.value;
      const pos = e.target.selectionStart;
      renderH2H();
      const ni = document.getElementById("h2hViewTeam2");
      if(ni){ ni.focus(); ni.setSelectionRange(pos, pos); }
    });
  }
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      h2hView = { team1: "", team2: "" };
      renderH2H();
    });
  }
}