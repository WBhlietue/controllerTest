const btns = document.querySelectorAll(".btn");
console.log(btns);
btns.forEach((i) => {
  i.ontouchstart = () => {
    const key = i.innerHTML.toLowerCase();
    fetch("http://192.168.1.28:8000/getKey", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ key: key, sameName: true }),
    });
  };
});
const onMove = [];
const onExit = [];
JoyStick("pad", "handle", "key");
JoyStick("pad1", "handle1", "angle");

document.onmousemove = (e) => {
  onMove.map((i) => {
    i(e);
  });
};
document.ontouchmove = (e) => {
  onMove.map((i) => {
    i(e);
  });
};
document.onmouseup = (e) => {
  onExit.map((i) => {
    i(e);
  });
};
document.ontouchend = (e) => {
  onExit.map((i) => {
    i(e);
  });
};
function JoyStick(parent, name, type) {
  const par = document.getElementById(parent);
  const handle = document.getElementById(name);
  let x = par.offsetLeft;
  let y = par.offsetTop;
  console.log(x, y);
  handle.style.left = "100px";
  handle.style.top = "100px";
  let isClick = false;
  let moveDirection = "";
  let sending = false;

  function SendRequest() {
    if (!sending) {
      return;
    }
    console.log(moveDirection);
    if (moveDirection != "") {
      console.log(moveDirection);
      fetch("http://192.168.1.28:8000/getKey", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          key: moveDirection.toLowerCase(),
          sameName: true,
          type: type
        }),
      }).then((res) => {
        SendRequest();
      });
    } else {
      setTimeout(() => {
        SendRequest();
      }, 10);
    }
  }

  function updateMoveDirection(vec) {
    if (vec) {
      if (Math.abs(vec.x) > Math.abs(vec.y)) {
        moveDirection = vec.x > 0 ? "D" : "A";
      } else {
        moveDirection = vec.y > 0 ? "S" : "W";
      }
    } else {
      fetch("http://192.168.1.28:8000/getKey", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ key: "over", sameName: true, type: type }),
      });
      moveDirection = "";
    }
  }

  function Down(e) {
    isClick = true;
    sending = true;
    SendRequest();
  }
  function Move(e) {
    if (isClick) {
        let vec = new Vector2(
          e.touches[0].clientX-x - 25,
          e.touches[0].clientY-y - 25
        );
    //   let vec = new Vector2(e.clientX - x - 25, e.clientY - y - 25);
      vec.Sub(new Vector2(100, 100));
      if (vec.Length() > 100) {
        vec.Normalize();
        vec.Mult(100);
      }
      updateMoveDirection(vec);
      vec.Sub(new Vector2(-100, -100));
      handle.style.left = vec.x + "px";
      handle.style.top = vec.y + "px";
    }
  }
  function Up(e) {
    if (isClick) {
      isClick = false;
      handle.style.left = "100px";
      handle.style.top = "100px";
      sending = false;
      updateMoveDirection(null);
    }
  }
  handle.onmousedown = Down;
  handle.ontouchstart = Down;
  onMove.push(Move);
  onExit.push(Up);
}

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  Length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  Normalize() {
    const length = this.Length();
    if (length !== 0) {
      this.x /= length;
      this.y /= length;
    }
  }
  Mult(num) {
    this.x *= num;
    this.y *= num;
  }
  Sub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }
  Clone() {
    return new Vector2(this.x, this.y);
  }
}
