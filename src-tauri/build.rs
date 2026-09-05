#[cfg(windows)]
fn main() {
    println!("cargo:rerun-if-changed=icons");
    println!("cargo:rerun-if-changed=macos/Assets.car");

    // tauri-build embeds its manifest via `rustc-link-arg-bins`, which never
    // reaches `cargo test` binaries. Without the v6 Common-Controls
    // activation context, comctl32 resolves to v5 — which lacks
    // TaskDialogIndirect — and every test exe dies at load with
    // STATUS_ENTRYPOINT_NOT_FOUND. So embed the (identical) manifest into
    // every artifact ourselves and turn tauri's copy off below.
    embed_resource::compile_for_everything("windows/app-manifest.rc", embed_resource::NONE)
        .manifest_required()
        .expect("failed to embed the Windows manifest");

    tauri_build::try_build(
        tauri_build::Attributes::new()
            .windows_attributes(tauri_build::WindowsAttributes::new_without_app_manifest()),
    )
    .expect("failed to run tauri-build");
}

#[cfg(not(windows))]
fn main() {
    // generate_context! embeds icons; cargo ignores them unless we watch here.
    println!("cargo:rerun-if-changed=icons");
    println!("cargo:rerun-if-changed=macos/Assets.car");

    tauri_build::build()
}
