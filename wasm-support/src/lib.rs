#[no_mangle]
pub fn calc_aspect(width: f64, height: f64) -> f64 {
    width / height
}

#[no_mangle]
pub fn calc_rotation(time: f64, momentum: f64) -> f64 {
    time * momentum
}