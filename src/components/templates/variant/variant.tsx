import React from "react"
import { Routes, Route } from "react-router-dom"
import Config from "./config/config"

const Variant = () => {
    return (
        <Routes>
                <Route path="/" element={<div>Variants</div>} />
                <Route path="/:create" element={<div>Create</div>} />
                <Route path="/:variant_id/*" element={<Config />} />
        </Routes>
    )
}

export default Variant