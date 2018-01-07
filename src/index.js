import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        console.log(this.props.value);
        let style_obj = {};
        if(this.props.value.disclosed) {
            style_obj['backgroundColor'] = '#b0b3b7';
        } else {
            if(this.props.value.flag) {
                style_obj['backgroundColor'] = 'red';
            } else style_obj['backgroundColor'] = '#ffffff';
        }
        let val = this.props.value.val;
        if(val === 1) style_obj['color'] = 'green';
        if(val === 2) style_obj['color'] = 'blue';
        if(val >= 3) style_obj['color'] = 'red';
        
        return (
            <button className="square" style={style_obj} onClick={this.props.onClick} onContextMenu={this.props.onRightClick}>
            {this.props.value.disclosed ? this.props.value.val : null}
            </button>
        );
    }
}

class Board extends React.Component {

    constructor(props) {
        super(props);

        const n = 9, mineCount = 10;
        let board = [];
        for(let i=0;i<n;i++) {
            let row = [];
            for(let j=0;j<n;j++) row.push(Object.assign({},{disclosed:0, val:null, flag:0}));
            board.push(row);
        }
        for(let i=0;i<mineCount;i++) {
            console.log(i);
            let x,y;
            do {
                x = Math.floor(Math.random()*100)%n;
                y = Math.floor(Math.random()*100)%n;
                if(board[x][y].val === null) board[x][y].val = 'M';
            } while(board[x][y].val !== 'M');
        }
        for(let i=0;i<n;i++) for(let j=0;j<n;j++) {
            if(board[i][j].val === 'M') {
                let dx = [-1,-1,-1,0,0,1,1,1], dy = [-1,0,1,-1,1,-1,0,1];
                for(let k=0;k<8;k++) {
                    let x = i+dx[k], y = j+dy[k];
                    if(x < 0 || y < 0 || x >= n || y >= n || board[x][y].val === 'M') continue;
                    board[x][y].val = board[x][y].val === null ? 1 : board[x][y].val+1;
                }
            }
        }
        for(let i=0;i<n;i++) {
            let row = ''
            for(let j=0;j<n;j++) row += (board[i][j].val ? board[i][j].val:' ') + ' ';
            console.log(row);
        }

        this.state = {
            n: n,
            board: board,
            mineCount: mineCount,
            won: false,
            lost: false
        };
    }


    dfs(x,y,b,n) {
        if(x < 0 || y < 0 || x >= n || y >= n || b[x][y].disclosed) return;
        b[x][y].disclosed = 1;
        if(b[x][y].val !== null) return;
        let dx = [-1,-1,-1,0,0,1,1,1], dy = [-1,0,1,-1,1,-1,0,1];
        for(let i=0;i<8;i++) this.dfs(x+dx[i],y+dy[i],b,n);
    }

    onRightClickHandle(e,x,y) {
        e.preventDefault();
        let b = this.state.board.map(x => x.slice());
        if(b[x][y].disclosed) return;
        b[x][y].flag ^= 1;
        this.setState({
            board: b
        });
        return;
    }

    onClickHandle(x,y) {
        if(this.state.won || this.state.lost) return;
        const n = this.state.n;
        let b = this.state.board.map(x => x.slice());
        if(b[x][y].val === 'M') {
            this.setState({
                lost: true
            });
        }
        this.dfs(x,y,b,n);

        let cnt = 0;
        for(let i=0;i<n;i++) for(let j=0;j<n;j++) if(!b[i][j].disclosed) cnt++;
        if(cnt === this.state.mineCount) {
            alert('You won!');
            this.setState({
                won: true
            });
        }

        this.setState({
            board: b
        });

    }

   render() {
       const n = this.state.n;
       let b = this.state.board;
       console.log('Board rendered');
       return (
               Array(n).fill(0).map((_e,x) => {
                   return (
                       <div className="board-row" key={x}> {Array(n).fill(0).map((_e,y) => {
                           return (<Square value={b[x][y]} key={n*x+y} onClick={() => this.onClickHandle(x,y)} onRightClick={(e) => this.onRightClickHandle(e,x,y)}/>);
                       })} </div>
                   );
               })
       );
   }
}

class Game extends React.Component {
    render() {
        return (
            <div>
            <h3> Welcome to Minesweeper! </h3>
            <Board /> 
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
