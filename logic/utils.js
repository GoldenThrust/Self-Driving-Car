export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function getIntersection(a, b, c, d) {
  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (a.x - b.x) * (c.y - a.y) - (a.y - b.y) * (c.x - a.x);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        offset: t
      }
    }
  }

  return null;
}

export function polysIntersect(poly1, poly2) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );

      if (touch) {
        return true;
      }
    }
  }

  return false;
}


export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomNumberInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


export function getRGBA(value) {
  const weight = value;
  const A = Math.abs(weight);
  const R = weight < 0 ? 0 : 255;
  const G = R;
  const B = weight > 0 ? 0 : 255;
  return `rgba(${R},${G},${B},${A})`;
}
export function generateRandomCars(N, road, Car, ctx, type = 'KEYBOARD', color = 'red') {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(ctx, road.getLaneCenter(getRandomNumber(1, 3)), getRandomNumber(-1000, 1000), innerWidth * 0.025, (innerWidth * 0.025) * 2, type === 'DUMMY' ? 2 : 20, color, type));
  }

  return cars;
}

export function getDistanceBetween(obj, obj2) {
  return Math.sqrt((obj.x - obj2.x) ** 2 + (obj.y - obj2.y) ** 2)
}

export function generateTrafficCars(N, road, Car, ctx, color = 'red') {
  const cars = [];
  const safeDistance = 500; // Minimum distance between cars on the y-axis for proximity
  const maxCarsInLane = 2; // Maximum cars allowed within safe distance in the same lane

  // Check if a new car can be placed in the lane without exceeding the limit
  function canPlaceCar(lane, y) {
    let nearbyCars = 0;

    for (const car of cars) {
      if (car.x === lane) {
        const distanceY = Math.abs(car.y - y);

        // Count cars within safe distance
        if (distanceY < safeDistance) {
          nearbyCars++;
        }

        // If two cars are already within the safe distance, reject placement
        if (nearbyCars >= maxCarsInLane) {
          return false;
        }
      }
    }

    return true;
  }

  // Generate traffic cars
  while (cars.length < N) {
    const lane = road.getLaneCenter(getRandomNumber(1, 3)); // Randomly choose a lane
    const y = -getRandomNumber(0, 20000); // Random y-coordinate

    if (canPlaceCar(lane, y)) {
      // Place the car if it passes the checks
      cars.push(new Car(ctx, lane, y, innerWidth * 0.025, (innerWidth * 0.025) * 2, 5, color, 'DUMMY'));
    }
  }

  return cars;
}

export function generateCars(N, road, Car, ctx, type = 'KEYBOARD', color = 'blue') {
  const cars = [];
  for (let i = 0; i < N; i++) {
    // cars.push(new Car(ctx, road.getLaneCenter(getRandomNumber(1, 3)), 200, 30, 60, type === 'DUMMY' ? 2 : 5, color, type));
    cars.push(new Car(ctx, road.getLaneCenter(2), 200, innerWidth * 0.025, (innerWidth * 0.025) * 2, type === 'DUMMY' ? 5 : 20, i !== N - 1 ? color : 'gold',type));
    // cars.push(new Car(ctx, road.getLaneCenter(2), 200, innerWidth * 0.025, (innerWidth * 0.025) * 2, type === 'DUMMY' ? 5 : 10, i !== N - 1 ? color : 'gold', i !== N - 1 ? type : 'KEYBOARD'));
  }

  return cars;
}