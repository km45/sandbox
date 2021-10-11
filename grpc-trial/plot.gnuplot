set terminal png
set output "plot.png"
plot "points.dat", "convex_hull.dat" with linespoints
