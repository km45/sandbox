# grpc-trial

## Python

### setup environment

Setup python environment using `requirements.txt` as below.

```sh
# create virtual environment (first time only)
python -m venv venv
pip install -r requirements.txt

# activate
source venv/bin/activate
```

### generate files by protoc

```sh
python -m grpc_tools.protoc -I protos --python_out=. --grpc_python_out=. --mypy_out=. --mypy_grpc_out=. protos/calculator.proto
```

### run server

```sh
python -m convex_hull_calculator_servicer
```

### run Python client

```sh
python -m convex_hull_calculator_client < points.dat
```

## C++

### setup build environment

```sh
# create docker image if necessary and start service
make up

# enter docker container
make shell
```

### build

```sh
# inside docker container
make build
```

### teardown build environment

```sh
# outside docker container
make down
```

### run C++ client

```sh
./build/Release/convex_hull_calculator_client < points.dat
```

## Plot result

```sh
# run one of clients and convert output to gnuplot data
python -m convex_hull_calculator_client < points.dat | jq -r '.[] | @sh' > convex_hull.dat
./build/Release/convex_hull_calculator_client < points.dat | jq -r '.[] | @sh' > convex_hull.dat

# plot data using gnuplot
gnuplot plot.gnuplot
```
